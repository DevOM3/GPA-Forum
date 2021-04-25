import Filter from "bad-words";

export const report = (text) => {
  const filter = new Filter();
  let reportedText = filter.clean(text);

  return !(text === reportedText);
};
