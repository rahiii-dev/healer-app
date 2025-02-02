import pkg from "agora-token";
const { RtcTokenBuilder, RtcRole } = pkg;

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

export function generateAgoraToken(channelName, uid, role = "publisher", expireTime = 86400) {
    if (!APP_ID || !APP_CERTIFICATE) {
        throw new Error("Missing Agora credentials in environment variables");
    }

    const tokenExpirationInSecond = expireTime;
    const privilegeExpirationInSecond = expireTime;

    const rtcRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channelName,
        uid,
        rtcRole,
        tokenExpirationInSecond,
        privilegeExpirationInSecond
    );

    return token;
}