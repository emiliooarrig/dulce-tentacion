export default function Contact() {
  return (
    <div className="page-contact">
      <div className="page-header">
        <h1>Contáctanos</h1>
        <p>Estamos para ayudarte a crear momentos dulces e inolvidables</p>
      </div>

      <div className="contact-grid">
        <div className="contact-card">
          <span className="contact-icon">📍</span>
          <h3>Ubicación</h3>
          <p>Naucalpan de Juárez</p>
          <p>Estado de México</p>
        </div>

        <div className="contact-card">
          <span className="contact-icon">📞</span>
          <h3>Teléfono</h3>
          <p>55 1296 9555</p>
          <p>Lunes a Sábado: 9:00 - 20:00</p>
        </div>

        <div className="contact-card">
          <span className="contact-icon">✉️</span>
          <h3>Email</h3>
          <p>contacto@dulcetentacion.com</p>
          <p>Respondemos en menos de 24 horas</p>
        </div>

        <div className="contact-card">
          <span className="contact-icon">📱</span>
          <h3>Redes Sociales</h3>
          <p>@dulcetentacion</p>
          <p>Instagram · Facebook · TikTok</p>
        </div>
      </div>

      <div className="contact-info-banner">
        <h3>¿Pedido especial o evento?</h3>
        <p>
          Contáctanos con al menos <strong>5 días de anticipación</strong> para pasteles personalizados
          y pedidos especiales para eventos.
        </p>
      </div>
    </div>
  );
}
