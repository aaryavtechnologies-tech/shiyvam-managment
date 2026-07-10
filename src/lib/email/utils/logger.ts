export function logEmailError(context: string, error: any) {
  console.error(`[Email Error] \${context}:`, error);
  // In a production app, this would pipe to Sentry or Datadog
}
