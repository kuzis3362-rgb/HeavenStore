// --- DEĞİŞKENLER ---
let sepet = JSON.parse(localStorage.getItem('heavenCart')) || {};

// --- BAŞLANGIÇ ---
document.addEventListener('DOMContentLoaded', () => {
    sayacGuncelle();
    if(document.getElementById('sepet-listesi')) sepetiYukle();
    
    // Eğer giriş yapmış bir kullanıcı varsa adını yaz
    const logUser = localStorage.getItem('currentUser');
    if(logUser && document.getElementById('userBtn')) {
        document.getElementById('userBtn').innerText = logUser.toUpperCase();
    }
});

// --- AUTH (GİRİŞ/KAYIT) SİSTEMİ ---
function authModalAc() { document.getElementById('authModal').style.display = 'flex'; }
function authModalKapat() { document.getElementById('authModal').style.display = 'none'; }

function tabDegistir(tip) {
    document.getElementById('tabGiris').classList.remove('active');
    document.getElementById('tabKayit').classList.remove('active');
    document.getElementById('formGiris').classList.remove('active');
    document.getElementById('formKayit').classList.remove('active');
    if(tip === 'giris') {
        document.getElementById('tabGiris').classList.add('active');
        document.getElementById('formGiris').classList.add('active');
    } else {
        document.getElementById('tabKayit').classList.add('active');
        document.getElementById('formKayit').classList.add('active');
    }
}

function kayitOl() {
    const ad = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    if(!ad || !email || !pass) return bildirimGoster("Eksik bilgi!");
    
    localStorage.setItem(`user_${email}`, JSON.stringify({ad, email, pass}));
    bildirimGoster("Üyeliğiniz oluşturuldu! ✨");
    tabDegistir('giris');
}

function girisYap() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const veri = localStorage.getItem(`user_${email}`);
    if(veri) {
        const u = JSON.parse(veri);
        if(u.pass === pass) {
            localStorage.setItem('currentUser', u.ad);
            document.getElementById('userBtn').innerText = u.ad.toUpperCase();
            authModalKapat();
            bildirimGoster(`Hoş geldin ${u.ad}!`);
        } else { bildirimGoster("Hatalı Şifre!"); }
    } else { bildirimGoster("Kullanıcı bulunamadı!"); }
}

// --- SEPET SİSTEMİ ---
function sepeteEkle(ad, fiyat, adet, beden) {
    const id = `${ad}-${beden}`;
    if(sepet[id]) sepet[id].miktar += adet;
    else sepet[id] = { ad, fiyat, miktar: adet, beden };
    localStorage.setItem('heavenCart', JSON.stringify(sepet));
    sayacGuncelle();
    bildirimGoster(`${ad} Sepete Eklendi! ✨`);
}

function sayacGuncelle() {
    let n = 0; Object.keys(sepet).forEach(k => n += sepet[k].miktar);
    const s = document.getElementById('sayac');
    if(s) s.innerText = n;
}

function sepetiYukle() {
    const liste = document.getElementById('sepet-listesi');
    if(!liste) return;
    liste.innerHTML = '<h2 style="margin-bottom:30px; font-weight:900;">Sepetim</h2>';
    let t = 0;
    Object.keys(sepet).forEach(key => {
        const u = sepet[key];
        t += u.fiyat * u.miktar;
        liste.innerHTML += `
            <div style="display:flex; align-items:center; gap:20px; background:#fff; padding:20px; border-radius:12px; margin-bottom:15px; border:1px solid #eee;">
                <div style="flex:1">
                    <h4 style="color:var(--primary-green)">${u.ad}</h4>
                    <p style="font-size:12px; color:#888;">Beden: ${u.beden}</p>
                    <strong>${u.fiyat} TL</strong>
                </div>
                <div style="display:flex; align-items:center; gap:15px; border:1px solid #ddd; padding:5px 15px; border-radius:8px;">
                    <button onclick="miktarDegistir('${key}', -1)" style="border:none; background:none; cursor:pointer; font-weight:bold;">-</button>
                    <span>${u.miktar}</span>
                    <button onclick="miktarDegistir('${key}', 1)" style="border:none; background:none; cursor:pointer; font-weight:bold;">+</button>
                </div>
            </div>`;
    });
    document.getElementById('ara-toplam').innerText = t + " TL";
    document.getElementById('genel-toplam').innerText = t + " TL";
}

function miktarDegistir(key, d) {
    sepet[key].miktar += d;
    if(sepet[key].miktar <= 0) delete sepet[key];
    localStorage.setItem('heavenCart', JSON.stringify(sepet));
    sepetiYukle(); sayacGuncelle();
}

function bildirimGoster(m) {
    let b = document.createElement('div');
    b.style = "position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:var(--primary-green); color:white; padding:15px 40px; border-radius:50px; font-weight:bold; z-index:99999; box-shadow:0 10px 30px rgba(0,0,0,0.2);";
    b.innerText = m;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 3000);
}

// --- ÖDEME GÜNCELLEME ---
function kartGuncelle() {
    if(document.getElementById('p-name')) document.getElementById('p-name').innerText = document.getElementById('c-name').value.toUpperCase() || "AD SOYAD";
    if(document.getElementById('p-no')) document.getElementById('p-no').innerText = document.getElementById('c-no').value || "**** **** **** ****";
    if(document.getElementById('p-date')) document.getElementById('p-date').innerText = document.getElementById('c-date').value || "00/00";
}

function siparisiBitir() {
    bildirimGoster("Ödeme Başarılı! Siparişiniz Alındı. ✨");
    localStorage.removeItem('heavenCart');
    setTimeout(() => window.location.href = 'index.html', 2000);
}