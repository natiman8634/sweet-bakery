
/**
 * Client-safe AI service stub.
 *
 * Note: The real Google GenAI SDK is server-side and must not be imported
 * into client bundles (it exposes API keys and may not run in the browser).
 * For production, implement these endpoints on a backend and call them via
 * fetch from the frontend. These functions return safe fallbacks so the
 * frontend build succeeds.
 */
export const aiService = {
  generateProductDescription: async (productName: string, category: string) => {
    return `Delicious ${productName}: a ${category} with a tender crumb, aromatic notes, and premium ingredients.`;
  },

  getAdminInsights: async (orders: any[], products: any[]) => {
    const totalOrders = orders?.length || 0;
    const lowStock = (products || []).filter((p: any) => (p.stock || 0) < 5).map((p: any) => p.name);
    return `Orders: ${totalOrders}. Low stock items: ${lowStock.join(', ') || 'none'}.`;
  },

  getDeliveryBrief: async (activeOrders: any[]) => {
    const count = activeOrders?.length || 0;
    return `You have ${count} deliveries. Prioritize older orders and group by neighborhood for efficiency.`;
  }
};
