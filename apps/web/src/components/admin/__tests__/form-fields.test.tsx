// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CommaListField, TextAreaField, TextField } from "../form-fields";

describe("CommaListField", () => {
  it("정상 콤마 분리되어야 한다", () => {
    const onChange = vi.fn();
    render(
      <CommaListField id="test" label="기술" value={[]} onChange={onChange} />
    );
    const input = screen.getByLabelText(/기술/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "TypeScript, Next.js, Prisma" } });
    expect(onChange).toHaveBeenCalledWith(["TypeScript", "Next.js", "Prisma"]);
  });

  it("각 항목 앞뒤 공백을 trim해야 한다", () => {
    const onChange = vi.fn();
    render(
      <CommaListField id="test" label="기술" value={[]} onChange={onChange} />
    );
    const input = screen.getByLabelText(/기술/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "  a  ,  b  ,  c  " } });
    expect(onChange).toHaveBeenCalledWith(["a", "b", "c"]);
  });

  it("빈 항목(연속 콤마)을 제거해야 한다", () => {
    const onChange = vi.fn();
    render(
      <CommaListField id="test" label="기술" value={[]} onChange={onChange} />
    );
    const input = screen.getByLabelText(/기술/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "a,,b,,," } });
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("빈 입력은 빈 배열을 반환해야 한다", () => {
    const onChange = vi.fn();
    render(
      <CommaListField id="test" label="기술" value={["기존"]} onChange={onChange} />
    );
    const input = screen.getByLabelText(/기술/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("초기 value 배열이 'a, b, c' 형태로 표시되어야 한다", () => {
    render(
      <CommaListField
        id="test"
        label="기술"
        value={["TypeScript", "Next.js"]}
        onChange={() => {}}
      />
    );
    const input = screen.getByLabelText(/기술/) as HTMLInputElement;
    expect(input.value).toBe("TypeScript, Next.js");
  });

  it("한글 항목도 정확히 분리되어야 한다", () => {
    const onChange = vi.fn();
    render(
      <CommaListField id="test" label="태그" value={[]} onChange={onChange} />
    );
    const input = screen.getByLabelText(/태그/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "프론트엔드, 백엔드, DB" } });
    expect(onChange).toHaveBeenCalledWith(["프론트엔드", "백엔드", "DB"]);
  });
});

describe("TextField", () => {
  it("required prop이 별표(*)를 표시해야 한다", () => {
    render(
      <TextField id="t" label="이름" value="" onChange={() => {}} required />
    );
    expect(screen.getByText("*")).toBeDefined();
  });

  it("type='date'이면 input type이 date여야 한다", () => {
    render(
      <TextField id="t" label="날짜" value="2026-04-30" onChange={() => {}} type="date" />
    );
    const input = screen.getByLabelText(/날짜/) as HTMLInputElement;
    expect(input.type).toBe("date");
  });

  it("입력 값이 onChange로 전달되어야 한다", () => {
    const onChange = vi.fn();
    render(<TextField id="t" label="이름" value="" onChange={onChange} />);
    const input = screen.getByLabelText(/이름/);
    fireEvent.change(input, { target: { value: "김코드" } });
    expect(onChange).toHaveBeenCalledWith("김코드");
  });
});

describe("TextAreaField", () => {
  it("rows prop이 적용되어야 한다", () => {
    render(
      <TextAreaField id="t" label="소개" value="" onChange={() => {}} rows={5} />
    );
    const textarea = screen.getByLabelText(/소개/) as HTMLTextAreaElement;
    // happy-dom은 rows를 string으로 보존
    expect(String(textarea.rows)).toBe("5");
  });

  it("입력 값이 onChange로 전달되어야 한다", () => {
    const onChange = vi.fn();
    render(<TextAreaField id="t" label="소개" value="" onChange={onChange} />);
    const textarea = screen.getByLabelText(/소개/);
    fireEvent.change(textarea, { target: { value: "여러줄\n텍스트" } });
    expect(onChange).toHaveBeenCalledWith("여러줄\n텍스트");
  });
});
