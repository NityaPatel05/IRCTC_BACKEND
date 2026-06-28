const KAFKA_TOPICS = {
  OTP_EMAIL: "notification.otp-email",
  WELCOME_EMAIL: "notification.welcome-email",

  DLQ_NOTIFICATION: "dlq.notification-service",
};

const DLQ_MAX_RETRIES = 3;

module.exports = { KAFKA_TOPICS, DLQ_MAX_RETRIES };
