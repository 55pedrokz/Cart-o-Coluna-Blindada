// ================= FEEDBACK SENSORIAL =================
function playPopSound() {
    // Vazio para navegação silenciosa
}

function playSuccessSound() {
    try { if (navigator.vibrate) navigator.vibrate([10]); } catch(e) {}
}

// ================= ILHA DINÂMICA =================
function showDynamicIsland(message) {
    const island = document.getElementById('dynamic-island');
    const msgText = document.getElementById('island-message');
    if (island && msgText) {
        msgText.innerText = message;
        island.classList.add('show');
        playSuccessSound();
        setTimeout(() => { island.classList.remove('show'); }, 3000);
    }
}

function morphIcon(iconId, tempClass, originalClass) {
    const icon = document.getElementById(iconId);
    if (icon) {
        icon.className = `fas fa-check icon-morph`;
        setTimeout(() => { icon.className = originalClass; }, 2000);
    }
}

// ================= EFEITO TILT 3D =================
function init3DTilt() {
    if (window.matchMedia("(pointer: fine)").matches) {
        const cards = document.querySelectorAll('.tilt-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const centerX = rect.width / 2; const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }
}

function openModal(modalId) {
    playPopSound(); 
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('modal-backdrop');
    const appScreen = document.getElementById('app-background');
    if (modal) {
        modal.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
        if (appScreen) appScreen.classList.add('cinematic-blur');
        const content = modal.querySelector('.modal-content');
        if(content) content.style.transform = '';
    }
}

function closeModal(modalId) {
    playPopSound(); 
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('modal-backdrop');
    const appScreen = document.getElementById('app-background');
    if (modal) {
        const content = modal.querySelector('.modal-content');
        if(content) { content.style.transition = ''; content.style.transform = ''; }
        modal.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        if (appScreen) appScreen.classList.remove('cinematic-blur');
    }
}

// ================= LIGHTBOX (ABRIR FOTOS) =================
function openLightbox(src) {
    playPopSound();
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if(lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.style.display = 'flex';
        // Pequeno atraso para a transição do CSS atuar
        setTimeout(() => { lightbox.classList.add('show'); }, 10);
    }
}

function closeLightbox() {
    playPopSound();
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        lightbox.classList.remove('show');
        setTimeout(() => { lightbox.style.display = 'none'; }, 300);
    }
}

// ================= EVENTOS PRINCIPAIS =================
document.addEventListener('DOMContentLoaded', () => {
    
    init3DTilt(); 

    const allButtons = document.querySelectorAll('.quick-btn, .list-btn, .social-btn');
    allButtons.forEach(btn => { btn.addEventListener('click', playPopSound); });

    const saudacaoElemento = document.getElementById('mensagem-saudacao');
    if (saudacaoElemento) {
        const horaAtual = new Date().getHours();
        let mensagem = 'Olá!';
        if (horaAtual >= 5 && horaAtual < 12) mensagem = 'Bom dia!';
        else if (horaAtual >= 12 && horaAtual < 18) mensagem = 'Boa tarde!';
        else mensagem = 'Boa noite!';
        saudacaoElemento.innerText = mensagem;
    }

    const splashScreen = document.getElementById('splash-screen');
    if(splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hide-splash');
            setTimeout(() => { 
                splashScreen.style.display = 'none'; 
                const revealItems = document.querySelectorAll('.reveal-item');
                revealItems.forEach(item => item.classList.add('visible'));
            }, 600);
        }, 1200);
    }

    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            document.querySelectorAll('.app-modal.active').forEach(modal => closeModal(modal.id));
        });
    }

    const btnPix = document.getElementById('btn-pix');
    if (btnPix) {
        btnPix.addEventListener('click', () => {
            const chave = btnPix.getAttribute('data-chave');
            morphIcon('icon-pix', 'fas fa-check', 'fab fa-pix'); 
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(chave).then(() => { showDynamicIsland('Chave PIX copiada!'); }).catch(() => fallbackCopiar(chave));
            } else { fallbackCopiar(chave); }
        });
    }

    function fallbackCopiar(texto) {
        const textArea = document.createElement("textarea");
        textArea.value = texto; textArea.style.position = "fixed"; textArea.style.opacity = "0";
        document.body.appendChild(textArea); textArea.focus(); textArea.select();
        try { document.execCommand('copy'); showDynamicIsland('Copiado com sucesso!'); } catch (err) {}
        document.body.removeChild(textArea);
    }

    const btnVcard = document.getElementById('btn-vcard');
    if (btnVcard) {
        btnVcard.addEventListener('click', () => {
            morphIcon('icon-vcard', 'fas fa-check', 'fas fa-user-plus');
            const vcardData = `BEGIN:VCARD\nVERSION:3.0\nFN:Coluna Blindada Fisioterapia\nORG:Coluna Blindada\nTITLE:Fisioterapia Integral\nTEL;TYPE=WORK,VOICE:+5512997325180\nADR;TYPE=WORK:;;Av. São Paulo, 482 - Cidade Nova;Pindamonhangaba;SP;12414-160;Brasil\nEND:VCARD`;
            try {
                const blob = new Blob([vcardData], { type: 'text/vcard' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a'); a.style.display = 'none'; a.href = url; a.download = 'Coluna_Blindada.vcf';
                document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url);
                showDynamicIsland('Contato salvo!');
            } catch (err) {}
        });
    }

    const btnShare = document.getElementById('btn-share');
    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            try {
                const shareData = { 
                    title: 'Coluna Blindada', 
                    text: 'Liberte-se das dores! Agende a sua avaliação na Coluna Blindada.', 
                    url: window.location.href 
                };

                // Tenta carregar a imagem da logo
                try {
                    const response = await fetch('img/Logo.jpg');
                    const blob = await response.blob();
                    const file = new File([blob], 'Logo.jpg', { type: blob.type });
                    
                    // Se o navegador suportar o envio de arquivos, anexa a imagem
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        shareData.files = [file];
                    }
                } catch (imgErr) {
                    console.log('Não foi possível anexar a imagem:', imgErr);
                }

                // Abre a janela de partilha
                if (navigator.share) { 
                    await navigator.share(shareData); 
                } else {
                    morphIcon('icon-share', 'fas fa-check', 'fas fa-share-nodes');
                    fallbackCopiar(window.location.href); 
                    showDynamicIsland('Link copiado!');
                }
            } catch (err) {}
        });
    }

    const imgQrCode = document.getElementById('qr-code-img');
    if (imgQrCode) {
        const urlAtual = window.location.href;
        const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(urlAtual)}&size=250&margin=2&dark=0b1e36`;
        const btnQr = document.getElementById('btn-qr');
        if(btnQr) {
            btnQr.addEventListener('click', () => {
                if(imgQrCode.src !== qrUrl) imgQrCode.src = qrUrl;
                openModal('modal-qr');
            });
        }
    }

    const modais = document.querySelectorAll('.app-modal');
    modais.forEach(modal => {
        
        if (modal.id === 'modal-fotos') return; 

        const content = modal.querySelector('.modal-content');
        let startY = 0; let currentY = 0; let isDragging = false;

        content.addEventListener('touchstart', (e) => {
            if (content.scrollTop === 0) {
                startY = e.touches[0].clientY; isDragging = true; content.style.transition = 'none'; 
            }
        }, { passive: true });

        content.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentY = e.touches[0].clientY;
            const diferenca = currentY - startY;

            if (diferenca > 0) {
                content.style.transform = `translateY(${diferenca}px)`;
                const backdrop = document.getElementById('modal-backdrop');
                if(backdrop) backdrop.style.opacity = Math.max(0, 1 - (diferenca / 300));
            }
        }, { passive: true });

        content.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            content.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
            const diferenca = currentY - startY;
            
            if (diferenca > 100) { closeModal(modal.id); } 
            else {
                content.style.transform = 'translateY(0)';
                const backdrop = document.getElementById('modal-backdrop');
                if(backdrop) backdrop.style.opacity = '1';
            }
            startY = 0; currentY = 0;
        });
    });
});
