export const defaultLimits = {
  limits: {
    fieldNameSize: 10,
    fieldSize: 512,
    fileSize: 2097152,
    headerPairs: 20,
  },
};

export const fileFilter = (_req, file, cb) => (
  file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
    ? cb(null, true)
    : cb(null, false)
);
