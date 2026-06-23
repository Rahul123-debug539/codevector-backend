const encodeCursor = ({ snapshotTime, updatedAt, id }) => {
  return Buffer.from(
    JSON.stringify({
      snapshotTime: snapshotTime.toISOString(),
      updatedAt: updatedAt.toISOString(),
      id: id.toString(),
    })
  ).toString("base64");
};

const decodeCursor = (cursor) => {
  try {
    const decoded = JSON.parse(
      Buffer.from(cursor, "base64").toString("utf8")
    );

    if (
      !decoded.snapshotTime ||
      !decoded.updatedAt ||
      !decoded.id
    ) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};

module.exports = {
  encodeCursor,
  decodeCursor,
};