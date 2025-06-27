import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class ImageGeneratorService {
  async generateOrderImage(orderData: any): Promise<string | null> {
    // Create a container element
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px'; // Off-screen
    container.innerHTML = this.orderJsonToHtml(orderData);

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, { backgroundColor: null });
      const image = canvas.toDataURL('image/png');
      document.body.removeChild(container);
      return image;
    } catch (e) {
      console.error('Image generation failed:', e);
      document.body.removeChild(container);
      return null;
    }
  }

  private orderJsonToHtml(order: any): string {
  const itemRows = order.items.map((itemObj: any) => `
    <tr>
      <td style="padding: 8px 0;">${itemObj.item}</td>
      <td style="padding: 8px 0;">${itemObj.quantity}</td>
    </tr>
  `).join('');

  return `
    <div style="
      width: 320px;
      font-family: 'Segoe UI', sans-serif;
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 16px;
      
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    ">
      <h3 style="margin-top: 0; margin-bottom: 12px;">🧾 Order Summary</h3>
      
      <p><strong>Pickup:</strong> ${order.pickup_address}</p>
      <p><strong>Dropoff:</strong> ${order.dropoff_address}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
        <thead>
          <tr>
            <th align="left">Item</th>
            <th align="left">Qty</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <hr style="margin: 12px 0;" />
      <p style="text-align: left; font-weight: bold;">Delivery Charges: $10</p>
    </div>
  `;
}
}

