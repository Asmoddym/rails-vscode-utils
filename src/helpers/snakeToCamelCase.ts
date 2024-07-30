const snakeToCamelCase = (input: string) =>
  input
    .split("_")
    .reduce(
      (res, word, i) =>
        `${res}${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`,
      "",
    );

    export default snakeToCamelCase;
