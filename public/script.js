document.addEventListener('DOMContentLoaded', () => {
  const classRadios = document.querySelectorAll('input[name="selectedClass"]');
  const totalAmountDisplay = document.getElementById('totalAmount');
  classRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const price = parseFloat(e.target.getAttribute('data-price')) || 0;
      totalAmountDisplay.textContent = `$${price.toFixed(2)}`;
    });
  });

  const canvas = document.getElementById('signatureCanvas');
  const ctx = canvas.getContext('2d');
  const hiddenSigInput = document.getElementById('signatureData');
  const clearBtn = document.getElementById('clearSignatureBtn');
  let isDrawing = false;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  function getPos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX || evt.touches[0].clientX) - rect.left,
      y: (evt.clientY || evt.touches[0].clientY) - rect.top
    };
  }

  function startDrawing(e) {
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      hiddenSigInput.value = canvas.toDataURL();
    }
  }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hiddenSigInput.value = '';
  });
});