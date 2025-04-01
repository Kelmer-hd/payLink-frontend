import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class PlanService {
    private planLimits = {
      FREE: { products: 3, variants: 2 },
      BASIC: { products: 15, variants: 5 },
      PRO: { products: -1, variants: -1 }
    };
  
    getCurrentPlanLimits() {
        return {
          products: 3,
          variants: 2
        };
      }
  }
  