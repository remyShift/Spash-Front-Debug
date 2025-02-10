type UpdateHomographyArguments = {
    camera: number[][];
    height: number;
    width: number;
    sport: string;
}

export const fetchHomography = async (params: UpdateHomographyArguments) => {

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
        console.log('Homography updated successfully :', data);
        return data;
    })
    .catch(error => {
        console.error('Error fetching homography :', error);
        throw error;
    });
}