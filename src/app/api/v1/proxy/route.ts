import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const data = await req.json();
    console.log('Data received:', data);
    return fetch('http://10.0.0.50:38001/api/homography', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept'
        },
        mode: 'cors',
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => NextResponse.json(data))
    .catch(error => {
        console.error('Error fetching homography:', error);
        return NextResponse.json({ error: 'Erreur lors de la requête proxy' });
    });
}