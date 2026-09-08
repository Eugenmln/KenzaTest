export default function CartDrawer({ open, items, user, onLogin, onClose, onRemove, onClear }) {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '5493760000000'
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  const message = [
    'Hola KOVA 👋 Quiero consultar por este pedido:',
    '',
    ...items.flatMap((item) => [
      `• ${item.name}`,
      `  Talle: ${item.size} | Color: ${item.color} | Cantidad: ${item.qty}`,
      `  $${(item.price * item.qty).toLocaleString('es-AR')}`,
      '',
    ]),
    `Total de referencia: $${total.toLocaleString('es-AR')}`,
    '',
    '¿Me confirman disponibilidad y formas de pago/envío?'
  ].join('\n')

  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}
      <aside className={open ? 'cart-drawer cart-drawer--open' : 'cart-drawer'}>
        <div className="cart-drawer__header">
          <div>
            <p className="eyebrow">Tu selección</p>
            <h2>Carrito</h2>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="cart-drawer__items">
          {items.length === 0 ? (
            <div className="empty-cart">Todavía no agregaste productos.</div>
          ) : items.map((item) => (
            <div className="cart-item" key={item.key}>
              <div>
                <strong>{item.name}</strong>
                <p>{item.size} · {item.color} · x{item.qty}</p>
              </div>
              <div className="cart-item__right">
                <span>${(item.price * item.qty).toLocaleString('es-AR')}</span>
                <button onClick={() => onRemove(item.key)}>Quitar</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-drawer__footer">
          <div className="cart-total"><span>Total</span><strong>${total.toLocaleString('es-AR')}</strong></div>
          {!user && items.length > 0 && (
            <div className="cart-account-note">
              <p>Podés continuar sin cuenta o iniciar sesión para guardar el carrito y tus pedidos.</p>
              <button className="text-button" onClick={onLogin}>Iniciar sesión</button>
            </div>
          )}
          <a className={`whatsapp-button ${items.length === 0 ? 'whatsapp-button--disabled' : ''}`} href={items.length ? waUrl : undefined} target="_blank" rel="noreferrer">
            Continuar por WhatsApp
          </a>
          {items.length > 0 && <button className="text-button" onClick={onClear}>Vaciar carrito</button>}
        </div>
      </aside>
    </>
  )
}
