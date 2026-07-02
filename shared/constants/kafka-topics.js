const KAFKA_TOPICS = {
  OTP_EMAIL: "notification.otp-email",
  WELCOME_EMAIL: "notification.welcome-email",

  DLQ_NOTIFICATION: "dlq.notification-service",

  STATION_CREATED: "admin.station-created",
  TRAIN_CREATED: "admin.train-created",
  ROUTE_CREATED: "admin.route-created",
  SCHEDULE_CREATED: "admin.schedule-created",
  SCHEDULE_CANCELLED: "admin.schedule-cancelled",
};

const DLQ_MAX_RETRIES = 3;

module.exports = { KAFKA_TOPICS, DLQ_MAX_RETRIES };
