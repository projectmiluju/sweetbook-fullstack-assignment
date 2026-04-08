import { describe, expect, it } from "vitest";

import {
  extractParamKeys,
  substituteParams,
} from "../param-substitute";

describe("substituteParams", () => {
  it("단일 파라미터를 치환해야 한다", () => {
    expect(substituteParams("$$name$$", { name: "김코드" })).toBe("김코드");
  });

  it("여러 파라미터를 치환해야 한다", () => {
    const result = substituteParams("$$monthNum$$/$$dayNum$$", {
      monthNum: "04",
      dayNum: "25",
    });
    expect(result).toBe("04/25");
  });

  it("동일 키가 여러 번 나오면 모두 치환해야 한다", () => {
    const result = substituteParams("$$name$$ - $$name$$", { name: "test" });
    expect(result).toBe("test - test");
  });

  it("정의되지 않은 키는 빈 문자열로 대체해야 한다", () => {
    expect(substituteParams("$$missing$$", {})).toBe("");
  });

  it("일부만 정의된 경우 정의된 것만 치환하고 나머지는 빈 문자열", () => {
    const result = substituteParams(
      "$$defined$$ / $$missing$$",
      { defined: "값" }
    );
    expect(result).toBe("값 / ");
  });

  it("$$ 패턴이 없으면 원본 그대로 반환해야 한다", () => {
    expect(substituteParams("plain text", {})).toBe("plain text");
  });

  it("빈 문자열을 입력하면 빈 문자열을 반환해야 한다", () => {
    expect(substituteParams("", { foo: "bar" })).toBe("");
  });

  it("줄바꿈 문자가 포함된 값도 정상 치환해야 한다", () => {
    const result = substituteParams("$$msg$$", { msg: "줄1\n줄2\n줄3" });
    expect(result).toBe("줄1\n줄2\n줄3");
  });

  it("파라미터 값이 빈 문자열이면 빈 문자열로 치환해야 한다", () => {
    expect(substituteParams("$$key$$", { key: "" })).toBe("");
  });

  it("긴 텍스트와 짧은 키를 정확히 치환해야 한다", () => {
    const long = "기능 구현보다 문제 정의가 더 중요하다는 점을 배웠습니다.";
    const result = substituteParams(
      "수료생 회고:\n\n$$diaryText$$",
      { diaryText: long }
    );
    expect(result).toBe(`수료생 회고:\n\n${long}`);
  });

  it("$$ 만 있고 키가 없는 문자열은 변경하지 않아야 한다", () => {
    expect(substituteParams("$$$$", {})).toBe("$$$$");
  });

  it("키 이름에 숫자가 포함된 경우 치환해야 한다", () => {
    expect(substituteParams("$$key1$$", { key1: "값" })).toBe("값");
  });

  it("키 이름이 숫자로 시작하면 치환하지 않아야 한다", () => {
    // PRD/SweetBook 패턴에 숫자로 시작하는 키 없음. 정규식이 [a-zA-Z]로 시작 강제.
    expect(substituteParams("$$1key$$", { "1key": "값" })).toBe("$$1key$$");
  });

  // QA: 치환 값에 String.replace 특수 패턴이 있어도 리터럴로 처리
  it("치환 값에 $& 특수 패턴이 있어도 리터럴로 처리되어야 한다", () => {
    // String.replace의 두 번째 인자가 callback이면 특수 패턴 해석 없음
    expect(substituteParams("$$key$$", { key: "$& 리터럴" })).toBe("$& 리터럴");
  });

  it("치환 값에 $1, $2 특수 패턴이 있어도 리터럴로 처리되어야 한다", () => {
    expect(substituteParams("$$key$$", { key: "$1 $2 $3" })).toBe("$1 $2 $3");
  });

  it("치환 값에 $$ 가 있어도 리터럴로 처리되어야 한다", () => {
    expect(substituteParams("$$key$$", { key: "$$" })).toBe("$$");
  });
});

describe("extractParamKeys", () => {
  it("단일 키를 추출해야 한다", () => {
    expect(extractParamKeys("$$name$$")).toEqual(["name"]);
  });

  it("여러 키를 추출해야 한다", () => {
    expect(extractParamKeys("$$a$$ $$b$$ $$c$$")).toEqual(["a", "b", "c"]);
  });

  it("중복된 키는 한 번만 반환해야 한다", () => {
    expect(extractParamKeys("$$name$$ - $$name$$ - $$age$$")).toEqual([
      "name",
      "age",
    ]);
  });

  it("키가 없으면 빈 배열을 반환해야 한다", () => {
    expect(extractParamKeys("plain text")).toEqual([]);
  });

  it("빈 문자열은 빈 배열을 반환해야 한다", () => {
    expect(extractParamKeys("")).toEqual([]);
  });
});
