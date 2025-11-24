// Route preloading utility for better performance
export class RoutePreloader {
   private static preloadedRoutes = new Set<string>();
   private static readonly idleTimeoutMs = 1000;
   private static readonly fallbackIdleDelayMs = 150;

   /**
    * Preload a route component
    * @param importFn - The lazy import function
    * @param routeKey - Unique identifier for the route
    */
   static preload(importFn: () => Promise<any>, routeKey: string) {
      if (this.preloadedRoutes.has(routeKey)) {
         return Promise.resolve();
      }

      this.preloadedRoutes.add(routeKey);
      return importFn();
   }

   /**
    * Preload multiple routes
    * @param routes - Array of route configurations
    */
   static preloadMultiple(
      routes: Array<{ importFn: () => Promise<any>; key: string }>
   ) {
      // Schedule sequentially during idle time to avoid blocking the main thread
      const tasks = routes.map(
         (route) => () => this.preload(route.importFn, route.key)
      );

      return tasks.reduce((chain, task) => {
         return chain.then(() => this.scheduleDuringIdle(task));
      }, Promise.resolve());
   }

   /**
    * Schedule a task during browser idle time (with a timeout fallback)
    */
   private static scheduleDuringIdle(task: () => Promise<any>) {
      return new Promise<void>((resolve) => {
         const win = globalThis as unknown as {
            requestIdleCallback?: any;
            cancelIdleCallback?: any;
         };
         const requestIdle =
            typeof win?.requestIdleCallback === "function"
               ? win.requestIdleCallback
               : (cb: () => void) => setTimeout(cb, this.fallbackIdleDelayMs);

         const cancelIdle =
            typeof win?.cancelIdleCallback === "function"
               ? win.cancelIdleCallback
               : (id: number) => clearTimeout(id);

         requestIdle(
            () => {
               task().finally(() => resolve());
            },
            { timeout: this.idleTimeoutMs }
         );

         // Safety: if the environment does not support idle callbacks, ensure we can clear timeouts
         // Return resolver is handled by finally above
         void cancelIdle; // keep reference for type completeness
      });
   }

   /**
    * Check if a route is already preloaded
    * @param routeKey - Unique identifier for the route
    */
   static isPreloaded(routeKey: string): boolean {
      return this.preloadedRoutes.has(routeKey);
   }

   /**
    * Clear preloaded routes (useful for testing or memory management)
    */
   static clear() {
      this.preloadedRoutes.clear();
   }
}

// Hook for preloading routes on hover
export const useRoutePreloader = () => {
   const preloadOnHover = (importFn: () => Promise<any>, routeKey: string) => {
      return {
         onMouseEnter: () => {
            RoutePreloader.preload(importFn, routeKey);
         },
      };
   };

   return { preloadOnHover };
};
