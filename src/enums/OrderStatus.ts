export const OrderStatus = {
  Pending: 0,
  Preparing: 1,
  Ready: 2,
  Completed: 3,
  Cancelled: 4,
} as const

// Union type of values
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

// Map of value → label (for parsing/display)
export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pending',
  [OrderStatus.Preparing]: 'Preparing',
  [OrderStatus.Ready]: 'Ready',
  [OrderStatus.Completed]: 'Completed',
  [OrderStatus.Cancelled]: 'Cancelled',
}

export function getOrderMessage(orderStatus: OrderStatus): string {
  switch (orderStatus) {
    case OrderStatus.Pending:
      return  `Please show this QR code at the counter to pay for your order.`;

    case OrderStatus.Preparing:
      return `Your order is being prepared! Hang tight, we’ll update you when it’s ready.`;

    case OrderStatus.Ready:
      return `Your order is ready for pickup! Head to the counter and pick up your order.`;

    case OrderStatus.Completed:
      return `Your order has been picked up. Thanks and enjoy your order!`;

    case OrderStatus.Cancelled:
      return `Your order was cancelled. Please ask our staff for assistance.`;

    default:
      return `We're processing your order. Please wait...`;
  }
}
