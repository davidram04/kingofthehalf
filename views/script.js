<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="1671.6">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; min-height: 14.0px}
  </style>
</head>
<body>
<p class="p1">document.addEventListener('DOMContentLoaded', () =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">  </span>// Total Price Calculation</p>
<p class="p1"><span class="Apple-converted-space">  </span>const classRadios = document.querySelectorAll('input[name="selectedClass"]');</p>
<p class="p1"><span class="Apple-converted-space">  </span>const totalAmountDisplay = document.getElementById('totalAmount');</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>classRadios.forEach(radio =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">    </span>radio.addEventListener('change', (e) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">      </span>const price = parseFloat(e.target.getAttribute('data-price')) || 0;</p>
<p class="p1"><span class="Apple-converted-space">      </span>totalAmountDisplay.textContent = `$${price.toFixed(2)}`;</p>
<p class="p1"><span class="Apple-converted-space">    </span>});</p>
<p class="p1"><span class="Apple-converted-space">  </span>});</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>// Signature Canvas Drawing</p>
<p class="p1"><span class="Apple-converted-space">  </span>const canvas = document.getElementById('signatureCanvas');</p>
<p class="p1"><span class="Apple-converted-space">  </span>const ctx = canvas.getContext('2d');</p>
<p class="p1"><span class="Apple-converted-space">  </span>const hiddenSigInput = document.getElementById('signatureData');</p>
<p class="p1"><span class="Apple-converted-space">  </span>const clearBtn = document.getElementById('clearSignatureBtn');</p>
<p class="p1"><span class="Apple-converted-space">  </span>let isDrawing = false;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>// Set line styling</p>
<p class="p1"><span class="Apple-converted-space">  </span>ctx.strokeStyle = '#000000';</p>
<p class="p1"><span class="Apple-converted-space">  </span>ctx.lineWidth = 2;</p>
<p class="p1"><span class="Apple-converted-space">  </span>ctx.lineCap = 'round';</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>function getPos(evt) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>const rect = canvas.getBoundingClientRect();</p>
<p class="p1"><span class="Apple-converted-space">    </span>return {</p>
<p class="p1"><span class="Apple-converted-space">      </span>x: (evt.clientX || evt.touches[0].clientX) - rect.left,</p>
<p class="p1"><span class="Apple-converted-space">      </span>y: (evt.clientY || evt.touches[0].clientY) - rect.top</p>
<p class="p1"><span class="Apple-converted-space">    </span>};</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>function startDrawing(e) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>isDrawing = true;</p>
<p class="p1"><span class="Apple-converted-space">    </span>const pos = getPos(e);</p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.beginPath();</p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.moveTo(pos.x, pos.y);</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>function draw(e) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>if (!isDrawing) return;</p>
<p class="p1"><span class="Apple-converted-space">    </span>e.preventDefault();</p>
<p class="p1"><span class="Apple-converted-space">    </span>const pos = getPos(e);</p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.lineTo(pos.x, pos.y);</p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.stroke();</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>function stopDrawing() {</p>
<p class="p1"><span class="Apple-converted-space">    </span>if (isDrawing) {</p>
<p class="p1"><span class="Apple-converted-space">      </span>isDrawing = false;</p>
<p class="p1"><span class="Apple-converted-space">      </span>hiddenSigInput.value = canvas.toDataURL();</p>
<p class="p1"><span class="Apple-converted-space">    </span>}</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>canvas.addEventListener('mousedown', startDrawing);</p>
<p class="p1"><span class="Apple-converted-space">  </span>canvas.addEventListener('mousemove', draw);</p>
<p class="p1"><span class="Apple-converted-space">  </span>canvas.addEventListener('mouseup', stopDrawing);</p>
<p class="p1"><span class="Apple-converted-space">  </span>canvas.addEventListener('mouseleave', stopDrawing);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>canvas.addEventListener('touchstart', startDrawing);</p>
<p class="p1"><span class="Apple-converted-space">  </span>canvas.addEventListener('touchmove', draw);</p>
<p class="p1"><span class="Apple-converted-space">  </span>canvas.addEventListener('touchend', stopDrawing);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>clearBtn.addEventListener('click', () =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">    </span>ctx.clearRect(0, 0, canvas.width, canvas.height);</p>
<p class="p1"><span class="Apple-converted-space">    </span>hiddenSigInput.value = '';</p>
<p class="p1"><span class="Apple-converted-space">  </span>});</p>
<p class="p1">});</p>
</body>
</html>
