'use client';

import { useState, useEffect, useReducer, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useProfileStats } from '@/features/profile/hooks/useProfileStats';
import { getOrder, payWithWallet, payWithMercadoPago, cancelOrder, type OrderResponse } from '@/lib/api/orders';
import {
  OrderTimeline,
  OrderInfoCards,
  OrderItems,
  OrderSidebarSummary,
} from '@/features/orders/components';
import {
  MobilePageContainer,
  DesktopPageContainer,
} from '@/features/shared/components/PageContainers';
import { FlowButton } from '@/features/shared/ui/flow-button';
import OrderSkeleton from './loading';

const PRICE_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return PRICE_FORMATTER.format(numPrice);
};

type OrderDetailAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: OrderResponse }
  | { type: 'FETCH_ERROR'; payload: string };

interface OrderDetailState {
  order: OrderResponse | null;
  loading: boolean;
  error: string | null;
}

function orderDetailReducer(state: OrderDetailState, action: OrderDetailAction): OrderDetailState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { order: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function OrderDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const orderId = params.id;
  const { back, push } = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { balance } = useProfileStats(isAuthenticated, {
    fetchOrders: false,
    fetchListings: false,
    fetchBalance: true,
  });

  const [processing, setProcessing] = useState(false);
  const [orderState, orderDispatch] = useReducer(orderDetailReducer, {
    order: null,
    loading: true,
    error: null,
  });
  const { order, loading, error } = orderState;

  const formattedDate = order
    ? new Date(order.createdAt).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      push('/login');
    }
  }, [isAuthenticated, authLoading, push]);

  // When MP redirects back with ?status=failure (user cancelled or card rejected),
  // cancel the still-PENDING order and send the user back to the cart.
  useEffect(() => {
    const mpStatus = searchParams.get('status');
    if (mpStatus !== 'failure' || !isAuthenticated || authLoading) return;

    let cancelled = false;
    cancelOrder(orderId)
      .catch(() => { /* already cancelled or not found — ignore */ })
      .finally(() => {
        if (!cancelled) push('/cart');
      });

    return () => { cancelled = true; };
  }, [searchParams, orderId, isAuthenticated, authLoading, push]);

  useEffect(() => {
    async function fetchOrder() {
      if (!isAuthenticated) return;
      // Don't bother fetching if we're about to redirect away
      if (searchParams.get('status') === 'failure') return;
      orderDispatch({ type: 'FETCH_START' });
      try {
        const data = await getOrder(orderId);
        orderDispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        console.error('Failed to fetch order', err);
        orderDispatch({
          type: 'FETCH_ERROR',
          payload: 'No se pudo cargar la información del pedido.',
        });
      }
    }
    fetchOrder();
  }, [orderId, isAuthenticated, searchParams]);

  const handlePayWithWallet = async () => {
    try {
      setProcessing(true);
      await payWithWallet(orderId);
      const updatedOrder = await getOrder(orderId);
      orderDispatch({ type: 'FETCH_SUCCESS', payload: updatedOrder });
    } catch (err) {
      console.error('Payment failed', err);
    } finally {
      setProcessing(false);
    }
  };

  const handlePayWithMercadoPago = async () => {
    try {
      setProcessing(true);
      const { initPoint } = await payWithMercadoPago(orderId);
      if (initPoint) {
        window.location.href = initPoint;
      }
    } catch (err) {
      console.error('MP redirection failed', err);
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return <OrderSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <p className="text-red-500 font-medium mb-4">{error || 'Pedido no encontrado'}</p>
        <FlowButton onClick={() => back()}>Volver</FlowButton>
      </div>
    );
  }

  return (
    <>
      <MobilePageContainer>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <FlowButton
              variant="ghost"
              simple
              onClick={() => back()}
              className="p-2 rounded-full transition-colors size-auto border-0"
            >
              <ArrowLeft className="text-xl text-text-muted" />
            </FlowButton>
            <h1 className="text-xl font-semibold text-text-body">Detalle de Pedido</h1>
          </div>

          <div className="flex flex-col gap-y-6 pb-24">
            <OrderTimeline order={order} />
            <OrderInfoCards order={order} />
            <OrderItems
              items={order.items}
              importationItems={order.importationItems}
              formatPrice={formatPrice}
            />
            <OrderSidebarSummary
              order={order}
              balance={balance}
              isProcessing={processing}
              onPayWithWallet={handlePayWithWallet}
              onPayWithMercadoPago={handlePayWithMercadoPago}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </MobilePageContainer>

      <DesktopPageContainer>
        <div className="max-w-6xl mx-auto py-10 px-6">
          <div className="flex items-center gap-4 mb-8">
            <FlowButton
              variant="ghost"
              simple
              onClick={() => back()}
              className="p-2 rounded-full transition-colors size-auto border-0"
            >
              <ArrowLeft className="text-2xl text-text-muted" />
            </FlowButton>
            <div>
              <h1 className="text-3xl font-semibold text-text-body">
                Orden #{order.id.slice(0, 8)}
              </h1>
              <p className="text-text-muted mt-1">Realizada el {formattedDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-y-8">
              <OrderTimeline order={order} />
              <OrderItems
                items={order.items}
                importationItems={order.importationItems}
                formatPrice={formatPrice}
              />
              <OrderInfoCards order={order} />
            </div>
            <div className="lg:col-span-1">
              <OrderSidebarSummary
                order={order}
                balance={balance}
                isProcessing={processing}
                onPayWithWallet={handlePayWithWallet}
                onPayWithMercadoPago={handlePayWithMercadoPago}
                formatPrice={formatPrice}
              />
            </div>
          </div>
        </div>
      </DesktopPageContainer>
    </>
  );
}


