// whatsapp-button.js
const whatsappBtn = document.createElement('a');
whatsappBtn.href = "https://wa.me/2250575719113";
whatsappBtn.target = "_blank";
whatsappBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20" height="20" viewBox="0 0 24 24">
    <path d="M12.003 2C6.477 2 2 6.477 2 12c0 1.991.58 3.84 1.568 5.403L2 22l4.683-1.538A9.95 9.95 0 0 0 12.003 22c5.523 0 10-4.477 10-10s-4.477-10-9.997-10zm-.003 18a7.951 7.951 0 0 1-4.271-1.26l-.304-.19-2.776.913.922-2.705-.197-.311A7.947 7.947 0 1 1 12 20zm4.411-5.834c-.24-.12-1.41-.696-1.63-.774-.22-.08-.38-.12-.54.12-.16.24-.62.774-.76.934-.14.16-.28.18-.52.06-.24-.12-1.01-.372-1.93-1.187-.713-.636-1.193-1.422-1.333-1.662-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.43-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.65 4.2 3.72.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.41-.57 1.61-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28z"/>
  </svg>
  <span style="margin-left: 8px;">WhatsApp</span>
`;
whatsappBtn.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #25D366;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  font-weight: bold;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  z-index: 999;
`;

document.body.appendChild(whatsappBtn);
