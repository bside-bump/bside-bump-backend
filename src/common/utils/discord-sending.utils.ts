import { Webhook } from 'discord-webhook-node'; //패키지 추가

export const sendingMsgToDiscord = async (hookUrl: string, message: string) => {
  const hook = new Webhook(hookUrl);
  await hook.send(message).then(() => console.log('결과 discord 전송 성공!'));
};
