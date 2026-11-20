/** Default each choice field to its first option. */
export const initial = fields =>
  Object.fromEntries(
    fields.filter(field => field.choices).map(field => [field.key, field.choices[0]]),
  );
