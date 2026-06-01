import {
  MobilePageContainer,
  DesktopPageContainer,
} from '@/features/shared/components/PageContainers';

export default function OrderSkeleton() {
  return (
    <>
      <MobilePageContainer>
        <div className="p-4 animate-pulse">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-full bg-surface-high" />
            <div className="h-6 w-48 bg-surface-high rounded-xl" />
          </div>

          <div className="flex flex-col gap-y-6 pb-24">
            {/* Timeline Skeleton */}
            <div className="bg-surface rounded-2xl border border-border-subtle p-5">
              <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-5">
                <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                  <div className="size-5 rounded bg-surface-high" />
                </div>
                <div>
                  <div className="h-4 w-32 bg-surface-high rounded-lg mb-2" />
                  <div className="h-3 w-48 bg-surface-high rounded-lg" />
                </div>
              </div>
              <div className="relative flex flex-col gap-y-10 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-border-subtle pl-1">
                {[
                  { w1: 'w-28', w2: 'w-36' },
                  { w1: 'w-32', w2: 'w-24' },
                  { w1: 'w-24', w2: 'w-40' },
                  { w1: 'w-36', w2: 'w-20' },
                ].map((step, idx) => (
                  <div key={idx} className="relative flex items-center gap-5">
                    <div className="size-10 rounded-full border-4 border-background bg-surface-low z-10 flex items-center justify-center">
                      <div className="size-3 rounded-full bg-surface-high" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className={`h-4 ${step.w1} bg-surface-high rounded-lg`} />
                        <div className="h-3 w-16 bg-surface-low rounded-lg shrink-0" />
                      </div>
                      <div className={`h-3 ${step.w2} bg-surface-low rounded-lg mt-2`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Cards Skeleton */}
            <div className="flex flex-col gap-y-5">
              {/* Shipping Card */}
              <div className="bg-surface rounded-2xl border border-border-subtle">
                <div className="p-5 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                      <div className="size-5 rounded bg-surface-high" />
                    </div>
                    <div>
                      <div className="h-4 w-16 bg-surface-high rounded-lg mb-2" />
                      <div className="h-3 w-40 bg-surface-low rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-y-4">
                  <div className="bg-surface-low p-4 rounded-xl border border-border-subtle">
                    <div className="flex items-start gap-3">
                      <div className="size-4 rounded-full bg-surface-high shrink-0 mt-0.5" />
                      <div className="flex-1 flex flex-col gap-y-2">
                        <div className="h-4 w-28 bg-surface-high rounded-lg" />
                        <div className="h-3 w-48 bg-surface-high/60 rounded-lg" />
                        <div className="h-3 w-32 bg-surface-high/60 rounded-lg" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-border-subtle/50 mt-1">
                    <div className="h-3 w-24 bg-surface-low rounded-lg" />
                    <div className="h-4 w-20 bg-surface-high rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Payment Card */}
              <div className="bg-surface rounded-2xl border border-border-subtle">
                <div className="p-5 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                      <div className="size-5 rounded bg-surface-high" />
                    </div>
                    <div>
                      <div className="h-4 w-12 bg-surface-high rounded-lg mb-2" />
                      <div className="h-3 w-44 bg-surface-low rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle/50">
                    <div className="h-3 w-16 bg-surface-low rounded-lg" />
                    <div className="h-4 w-24 bg-surface-high rounded-lg" />
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle/50">
                    <div className="h-3 w-12 bg-surface-low rounded-lg" />
                    <div className="h-4 w-20 bg-surface-high rounded-lg" />
                  </div>
                  <div className="flex flex-col gap-y-2 pt-1">
                    <div className="h-3 w-20 bg-surface-low rounded-lg" />
                    <div className="h-8 w-full bg-surface-low rounded-lg border border-border-subtle/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Items Skeleton */}
            <div className="bg-surface rounded-2xl border border-border-subtle p-5">
              <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-5">
                <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                  <div className="size-5 rounded bg-surface-high" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-surface-high rounded-lg mb-2" />
                  <div className="h-3 w-36 bg-surface-low rounded-lg" />
                </div>
              </div>
              <div className="flex flex-col gap-y-5">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-24 h-32 bg-surface-low rounded-xl border border-border-subtle shrink-0" />
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="h-4 w-3/4 bg-surface-high rounded-lg mb-2" />
                      <div className="h-4 w-1/2 bg-surface-high rounded-lg mb-3" />
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-5 w-12 bg-surface-low rounded-full" />
                        <span className="size-1 rounded-full bg-border-subtle" />
                        <div className="h-3 w-16 bg-surface-low rounded-lg" />
                      </div>
                      <div className="h-7 w-24 bg-primary/10 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Summary Skeleton (Stacked) */}
            <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden">
              <div className="p-5 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                    <div className="size-5 rounded bg-surface-high" />
                  </div>
                  <div>
                    <div className="h-4 w-20 bg-surface-high rounded-lg mb-2" />
                    <div className="h-3 w-28 bg-surface-low rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="h-3.5 w-16 bg-surface-low rounded-lg" />
                    <div className="h-4 w-20 bg-surface-high rounded-lg" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3.5 w-12 bg-surface-low rounded-lg" />
                    <div className="h-4 w-16 bg-surface-high rounded-lg" />
                  </div>
                </div>
                <div className="border-t border-border-subtle pt-4 mt-1">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-y-1.5">
                      <div className="h-3 w-20 bg-surface-low rounded-lg" />
                      <div className="h-8 w-28 bg-primary/20 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="h-12 w-full bg-surface-high rounded-xl mt-4" />
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  <div className="size-3 rounded bg-surface-low" />
                  <div className="h-3 w-40 bg-surface-low rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MobilePageContainer>

      <DesktopPageContainer>
        <div className="max-w-6xl mx-auto py-10 px-6 animate-pulse">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="size-10 rounded-full bg-surface-high" />
            <div>
              <div className="h-8 w-48 bg-surface-high rounded-xl mb-2" />
              <div className="h-4 w-64 bg-surface-high rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-y-8">
              {/* Timeline Skeleton */}
              <div className="bg-surface rounded-2xl border border-border-subtle p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-5">
                  <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                    <div className="size-5 rounded bg-surface-high" />
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-surface-high rounded-lg mb-2" />
                    <div className="h-3 w-48 bg-surface-high rounded-lg" />
                  </div>
                </div>
                <div className="relative flex flex-col gap-y-10 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-border-subtle pl-1">
                  {[
                    { w1: 'w-28', w2: 'w-36' },
                    { w1: 'w-32', w2: 'w-24' },
                    { w1: 'w-24', w2: 'w-40' },
                    { w1: 'w-36', w2: 'w-20' },
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-center gap-5">
                      <div className="size-10 rounded-full border-4 border-background bg-surface-low z-10 flex items-center justify-center">
                        <div className="size-3 rounded-full bg-surface-high" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <div className={`h-4 ${step.w1} bg-surface-high rounded-lg`} />
                          <div className="h-3 w-16 bg-surface-low rounded-lg shrink-0" />
                        </div>
                        <div className={`h-3 ${step.w2} bg-surface-low rounded-lg mt-2`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Skeleton */}
              <div className="bg-surface rounded-2xl border border-border-subtle p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-5">
                  <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                    <div className="size-5 rounded bg-surface-high" />
                  </div>
                  <div>
                    <div className="h-4 w-24 bg-surface-high rounded-lg mb-2" />
                    <div className="h-3 w-36 bg-surface-low rounded-lg" />
                  </div>
                </div>
                <div className="flex flex-col gap-y-5">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-24 h-32 bg-surface-low rounded-xl border border-border-subtle shrink-0" />
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="h-4 w-3/4 bg-surface-high rounded-lg mb-2" />
                        <div className="h-4 w-1/2 bg-surface-high rounded-lg mb-3" />
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-5 w-12 bg-surface-low rounded-full" />
                          <span className="size-1 rounded-full bg-border-subtle" />
                          <div className="h-3 w-16 bg-surface-low rounded-lg" />
                        </div>
                        <div className="h-7 w-24 bg-primary/10 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Cards Skeleton */}
              <div className="flex flex-col gap-y-5">
                {/* Shipping Card */}
                <div className="bg-surface rounded-2xl border border-border-subtle">
                  <div className="p-5 border-b border-border-subtle">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                        <div className="size-5 rounded bg-surface-high" />
                      </div>
                      <div>
                        <div className="h-4 w-16 bg-surface-high rounded-lg mb-2" />
                        <div className="h-3 w-40 bg-surface-low rounded-lg" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-y-4">
                    <div className="bg-surface-low p-4 rounded-xl border border-border-subtle">
                      <div className="flex items-start gap-3">
                        <div className="size-4 rounded-full bg-surface-high shrink-0 mt-0.5" />
                        <div className="flex-1 flex flex-col gap-y-2">
                          <div className="h-4 w-28 bg-surface-high rounded-lg" />
                          <div className="h-3 w-48 bg-surface-high/60 rounded-lg" />
                          <div className="h-3 w-32 bg-surface-high/60 rounded-lg" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-border-subtle/50 mt-1">
                      <div className="h-3 w-24 bg-surface-low rounded-lg" />
                      <div className="h-4 w-20 bg-surface-high rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Payment Card */}
                <div className="bg-surface rounded-2xl border border-border-subtle">
                  <div className="p-5 border-b border-border-subtle">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                        <div className="size-5 rounded bg-surface-high" />
                      </div>
                      <div>
                        <div className="h-4 w-12 bg-surface-high rounded-lg mb-2" />
                        <div className="h-3 w-44 bg-surface-low rounded-lg" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border-subtle/50">
                      <div className="h-3 w-16 bg-surface-low rounded-lg" />
                      <div className="h-4 w-24 bg-surface-high rounded-lg" />
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-border-subtle/50">
                      <div className="h-3 w-12 bg-surface-low rounded-lg" />
                      <div className="h-4 w-20 bg-surface-high rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-y-2 pt-1">
                      <div className="h-3 w-20 bg-surface-low rounded-lg" />
                      <div className="h-8 w-full bg-surface-low rounded-lg border border-border-subtle/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              {/* Sidebar Summary Skeleton */}
              <div className="bg-surface rounded-2xl border border-border-subtle overflow-hidden sticky top-6">
                <div className="p-5 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-surface-low flex items-center justify-center">
                      <div className="size-5 rounded bg-surface-high" />
                    </div>
                    <div>
                      <div className="h-4 w-20 bg-surface-high rounded-lg mb-2" />
                      <div className="h-3 w-28 bg-surface-low rounded-lg" />
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="h-3.5 w-16 bg-surface-low rounded-lg" />
                      <div className="h-4 w-20 bg-surface-high rounded-lg" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-3.5 w-12 bg-surface-low rounded-lg" />
                      <div className="h-4 w-16 bg-surface-high rounded-lg" />
                    </div>
                  </div>

                  <div className="border-t border-border-subtle pt-4 mt-1">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-y-1.5">
                        <div className="h-3 w-20 bg-surface-low rounded-lg" />
                        <div className="h-8 w-28 bg-primary/20 rounded-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="h-12 w-full bg-surface-high rounded-xl mt-4" />

                  <div className="flex items-center justify-center gap-1.5 pt-2">
                    <div className="size-3 rounded bg-surface-low" />
                    <div className="h-3 w-40 bg-surface-low rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DesktopPageContainer>
    </>
  );
}
