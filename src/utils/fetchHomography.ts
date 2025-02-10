type UpdateHomographyArguments = {
    camera: number[][];
    height: number;
    width: number;
    sport: string;
}

export const fetchHomography = async (params: UpdateHomographyArguments) => {
    console.log('Fetching homography with params:', JSON.stringify(params));
    return fetch(`/api/v1/proxy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Homography mise à jour avec succès:', data);
        return data;
    })
    .catch(error => {
        console.error('Error fetching homography:', error);
        throw error;
    });
}