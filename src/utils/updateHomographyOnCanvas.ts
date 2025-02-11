import { fetchHomography } from './fetchHomography';
import { drawHomography } from './drawing/drawHomography';
import { JSONData } from '@/types/files';

export const updateHomographyOnCanvas = async (
    homographyPoints: { [key: string]: { name: string, camera: number[], object?: number[] } },
    videoData: JSONData,
    videoRef: HTMLVideoElement | null
) => {
    if (!videoRef) return;

    const homographyData = Object.values(homographyPoints).map(point => ({
        name: point.name,
        camera: point.camera,
        object: point.object || [0, 0]
    }));

    const response = await fetchHomography({
        camera: homographyData.map(point => point.camera),
        height: videoData.info.video.height,
        width: videoData.info.video.width,
        sport: videoData.info.cfg.sport
    });

    if (response?.code === 0 && response?.data?.homography) {
        const mainCanvas = document.querySelector('canvas');
        if (mainCanvas) {
            const context = mainCanvas.getContext('2d');
            if (context) {
                context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                drawHomography(
                    response.data.homography,
                    videoRef.videoWidth,
                    videoRef.videoHeight,
                    context
                );
            }
        }
    }
};