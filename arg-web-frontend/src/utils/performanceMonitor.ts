// Performance monitoring utility for route loading
export class PerformanceMonitor {
   private static routeLoadTimes = new Map<string, number>();
   private static routeStartTimes = new Map<string, number>();

   /**
    * Start timing a route load
    * @param routeKey - Unique identifier for the route
    */
   static startRouteLoad(routeKey: string) {
      this.routeStartTimes.set(routeKey, performance.now());
   }

   /**
    * End timing a route load
    * @param routeKey - Unique identifier for the route
    */
   static endRouteLoad(routeKey: string) {
      const startTime = this.routeStartTimes.get(routeKey);
      if (startTime) {
         const loadTime = performance.now() - startTime;
         this.routeLoadTimes.set(routeKey, loadTime);
         this.routeStartTimes.delete(routeKey);

        
      }
   }

   /**
    * Get average load time for a route
    * @param routeKey - Unique identifier for the route
    */
   static getAverageLoadTime(routeKey: string): number {
      return this.routeLoadTimes.get(routeKey) || 0;
   }

   /**
    * Get all route load times
    */
   static getAllLoadTimes(): Record<string, number> {
      const result: Record<string, number> = {};
      this.routeLoadTimes.forEach((time, key) => {
         result[key] = time;
      });
      return result;
   }

   /**
    * Clear all performance data
    */
   static clear() {
      this.routeLoadTimes.clear();
      this.routeStartTimes.clear();
   }
}

// Hook for monitoring route performance
export const useRoutePerformance = () => {
   const startRouteLoad = (routeKey: string) => {
      PerformanceMonitor.startRouteLoad(routeKey);
   };

   const endRouteLoad = (routeKey: string) => {
      PerformanceMonitor.endRouteLoad(routeKey);
   };

   const getLoadTime = (routeKey: string) => {
      return PerformanceMonitor.getAverageLoadTime(routeKey);
   };

   return {
      startRouteLoad,
      endRouteLoad,
      getLoadTime,
   };
};
