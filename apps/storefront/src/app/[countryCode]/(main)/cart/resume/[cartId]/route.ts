import { sdk } from "@/lib/config"
import { activateCart } from "@/lib/util/server-cart"
import { getRequestOrigin } from "@/lib/util/site"
import { NextResponse } from "next/server"

const NO_STORE = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
}

/** UCP checkout `continue_url`: hands an agent-built cart to the buyer for payment. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ countryCode: string; cartId: string }> }
) {
  const { countryCode, cartId } = await params

  const cart = await sdk.store.cart
    .retrieve(cartId, { fields: "id,completed_at,metadata" })
    .then(({ cart }) => cart)
    .catch(() => null)

  if (!cart || cart.completed_at || cart.metadata?.ucp_canceled === true) {
    return new NextResponse("This cart link has expired", {
      status: 410,
      headers: NO_STORE,
    })
  }

  try {
    await sdk.store.cart.update(cartId, {
      metadata: { ...cart.metadata, ucp_handed_off: true },
    })
  } catch {
    // Never block the buyer's redirect on the handoff stamp; a cart bound to a
    // customer account is already cut off from UCP via `customer_id`.
  }

  await activateCart(cartId)

  return NextResponse.redirect(
    `${getRequestOrigin(request)}/${countryCode}/checkout`,
    { status: 303, headers: NO_STORE }
  )
}
