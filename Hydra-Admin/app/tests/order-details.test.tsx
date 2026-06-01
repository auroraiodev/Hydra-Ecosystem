import './dom-setup';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import OrderDetailsPage from '../app/(dashboard)/dashboard/orders/[id]/page';
import { ordersAPI } from '../lib/api';

// Mock the API functions
vi.mock('../../lib/api', () => ({
  ordersAPI: {
    get: vi.fn(),
    updateItemDeliveryStatus: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

// Mock useModal hook
vi.mock('@/components/providers/modal-context', () => ({
  useModal: () => ({
    showConfirm: vi.fn(),
    showLoading: vi.fn(),
    hideModal: vi.fn(),
  }),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

// Fallback for vi.mocked in environments that do not define it (like bun test)
if (!vi.mocked) {
  (vi as any).mocked = (fn: any) => fn;
}

// Mock subcomponents to isolate the test of OrderDetailsPage
vi.mock('../app/(dashboard)/dashboard/orders/[id]/components/OrderItemsCard', () => ({
  OrderItemsCard: () => <div data-testid="order-items-card">OrderItemsCard</div>,
}));
vi.mock('../app/(dashboard)/dashboard/orders/[id]/components/OrderTimelineCard', () => ({
  OrderTimelineCard: () => <div data-testid="order-timeline-card">OrderTimelineCard</div>,
}));
vi.mock('../app/(dashboard)/dashboard/orders/[id]/components/OrderDetailsSidebar', () => ({
  OrderDetailsSidebar: () => <div data-testid="order-details-sidebar">OrderDetailsSidebar</div>,
}));
vi.mock('@/components/orders/add-item-modal', () => ({
  AddItemModal: () => <div data-testid="add-item-modal">AddItemModal</div>,
}));

describe('OrderDetailsPage - Auto-marking Sold Logic', () => {
  // Pre-fulfilled thenable to bypass React 19 / Next.js 15 async useParams suspension
  const mockParams = {
    status: 'fulfilled',
    value: { id: 'test-order-id' },
    then: () => {},
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    if (global.document) {
      global.document.body.innerHTML = '';
    }
  });

  it('automatically marks pending local inventory items as sold when Mercado Pago payment is approved', async () => {
    // Mock get response showing an approved Mercado Pago order with a pending local item
    ordersAPI.get = vi.fn(() => Promise.resolve({
      id: 'test-order-id',
      order_number: 'ORD-100',
      status: 'PAID',
      payment_method: 'mercadopago',
      payment_status: 'approved',
      payment: {
        paymentMethod: 'mercadopago',
        status: 'approved',
      },
      items: [
        {
          id: 'item-1',
          single_id: 'single-1',
          isLocalInventory: true,
          is_delivered: false,
          delivery_status: 'pending',
          quantity: 1,
          unit_price: 10,
          singles: {
            id: 'single-1',
            cardName: 'Test Card',
          },
        },
      ],
    })) as any;

    ordersAPI.updateItemDeliveryStatus = vi.fn(() => Promise.resolve({ success: true }));

    render(<OrderDetailsPage params={mockParams} />);

    // Wait for the components to load and expect updateItemDeliveryStatus to be called
    await waitFor(() => {
      expect(ordersAPI.updateItemDeliveryStatus).toHaveBeenCalledWith(
        'test-order-id',
        'item-1',
        { isDelivered: true }
      );
    });
  });

  it('does NOT mark local inventory items as sold if the status is not pending (e.g. ready)', async () => {
    // Mock get response showing an approved Mercado Pago order with a 'ready' local item
    ordersAPI.get = vi.fn(() => Promise.resolve({
      id: 'test-order-id',
      order_number: 'ORD-100',
      status: 'PAID',
      payment_method: 'mercadopago',
      payment_status: 'approved',
      payment: {
        paymentMethod: 'mercadopago',
        status: 'approved',
      },
      items: [
        {
          id: 'item-1',
          single_id: 'single-1',
          isLocalInventory: true,
          is_delivered: false,
          delivery_status: 'ready', // manually set to 'ready' by admin
          quantity: 1,
          unit_price: 10,
          singles: {
            id: 'single-1',
            cardName: 'Test Card',
          },
        },
      ],
    })) as any;

    ordersAPI.updateItemDeliveryStatus = vi.fn(() => Promise.resolve({ success: true }));

    const { getByTestId } = render(<OrderDetailsPage params={mockParams} />);

    // Wait for page to finish loading (we can wait for mocked components to appear)
    await waitFor(() => {
      expect(getByTestId('order-items-card')).toBeDefined();
    });

    // Expect updateItemDeliveryStatus to NOT have been called, because the status is not 'pending'
    expect(ordersAPI.updateItemDeliveryStatus).not.toHaveBeenCalled();
  });
});
