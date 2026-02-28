const MP_ACCESS_TOKEN = "APP_USR-4501994398521531-012313-6b6f061908b8f4aa966f30ae88e43823-772205571";

async function checkMP() {
    const email = "maxi.aperio@gmail.com";
    console.log("Fetching MP preapprovals for", email);
    const res = await fetch(`https://api.mercadopago.com/preapproval/search?payer_email=${email}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
    });

    if (!res.ok) {
        console.log("Error fetching MP API", res.status, await res.text());
        return;
    }

    const data = await res.json();
    console.log("Found", data.results?.length || 0, "preapprovals in MP");

    if (data.results) {
        for (const sub of data.results) {
            if (sub.status === 'authorized' || sub.status === 'pending') {
                console.log(`Canceling MP sub: ${sub.id} (Status: ${sub.status}, reason: ${sub.reason})`);
                const cancelRes = await fetch(`https://api.mercadopago.com/preapproval/${sub.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'cancelled' })
                });
                console.log(`Cancel result for ${sub.id}:`, cancelRes.status, await cancelRes.text());
            } else {
                console.log(`Sub ${sub.id} already ${sub.status} (reason: ${sub.reason})`);
            }
        }
    }
}

checkMP().catch(console.error);
