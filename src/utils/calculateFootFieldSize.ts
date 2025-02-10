import { JSONData } from "@/types/files";

export const calculateFootFieldSize = (jsonInfo: JSONData["info"]) => {
    if (!jsonInfo.homography) return;

    const cornerLeft = jsonInfo.homography.find((item) => item.name === "TOP_LEFT_CORNER");
    const cornerRight = jsonInfo.homography.find((item) => item.name === "TOP_RIGHT_CORNER");
    
    if (!cornerLeft || !cornerRight) return;

    const height = Math.abs(cornerRight.object[0]) + Math.abs(cornerLeft.object[0]);
    const width = Math.abs(cornerRight.object[1]) + Math.abs(cornerLeft.object[1]);

    const goalLeft = jsonInfo.homography.find((item) => item.name === "LEFT_GOAL_POST_BOT");
    const goalRight = jsonInfo.homography.find((item) => item.name === "LEFT_GOAL_POST_TOP");

    if (!goalLeft || !goalRight) return;

    const goalWidth = Math.abs(goalRight.object[1]) + Math.abs(goalLeft.object[1]);

    return {
        height,
        width,
        goalWidth
    }
}

