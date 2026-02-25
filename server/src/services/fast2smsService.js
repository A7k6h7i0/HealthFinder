import axios from "axios";

const FAST2SMS_ENDPOINT = "https://www.fast2sms.com/dev/bulkV2";

const isValidIndianLocal = (digits10) => /^[6-9]\d{9}$/.test(digits10);

export const formatIndianPhoneForFast2SMS = (rawPhone) => {
  const value = String(rawPhone || "").trim();
  if (!value) return "";

  const digitsOnly = value.replace(/\D/g, "");

  if (value.startsWith("+91")) {
    const local = digitsOnly.slice(2);
    return isValidIndianLocal(local) ? local : "";
  }

  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    const local = digitsOnly.slice(2);
    return isValidIndianLocal(local) ? local : "";
  }

  if (digitsOnly.length === 10) {
    return isValidIndianLocal(digitsOnly) ? digitsOnly : "";
  }

  return "";
};

export const hasFast2SMSConfig = () =>
  Boolean(process.env.FAST2SMS_API_KEY && process.env.FAST2SMS_MESSAGE_ID && process.env.FAST2SMS_SENDER_ID);

export const sendOtpSmsViaFast2SMS = async ({ phone, otp }) => {
  if (!hasFast2SMSConfig()) {
    throw new Error("FAST2SMS_CONFIG_MISSING");
  }

  const numbers = formatIndianPhoneForFast2SMS(phone);
  if (!numbers) {
    throw new Error("FAST2SMS_INVALID_PHONE");
  }

  const payload = new URLSearchParams({
    route: "dlt",
    sender_id: process.env.FAST2SMS_SENDER_ID,
    message: process.env.FAST2SMS_MESSAGE_ID,
    variables_values: otp,
    numbers,
    flash: "0"
  });

  const response = await axios.post(FAST2SMS_ENDPOINT, payload.toString(), {
    headers: {
      authorization: process.env.FAST2SMS_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    timeout: 10000
  });

  if (!response?.data || response.data.return !== true) {
    throw new Error("FAST2SMS_SEND_FAILED");
  }

  return response.data;
};
