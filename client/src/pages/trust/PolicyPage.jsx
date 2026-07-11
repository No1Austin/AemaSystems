import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Link2,
  LoaderCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";
import TrustLayout from "../../components/trust/TrustLayout";
import PolicySection from "../../components/trust/PolicySection";

export default function PolicyPage() {
  const { slug } = useParams();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    async function fetchPolicy() {
      try {
        setLoading(true);
        setErrorMessage("");

        const { data, error } = await supabase
          .from("governance_policies")
          .select("*")
          .eq("slug", slug)
          .eq("status", "Published")
          .eq("is_public", true)
          .maybeSingle();

        if (!isMounted) return;

        if (error) {
          console.error("Failed to load policy:", error);

          setPolicy(null);
          setErrorMessage(
            error.message ||
              "Unable to load this policy right now."
          );

          return;
        }

        if (!data) {
          setPolicy(null);
          setErrorMessage(
            "This policy may not exist yet or has not been published."
          );

          return;
        }

        setPolicy(data);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) return;

        console.error(
          "Unexpected policy loading error:",
          error
        );

        setPolicy(null);
        setErrorMessage(
          error?.message ||
            "An unexpected error occurred while loading the policy."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPolicy();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const parsedContent = useMemo(
    () => parsePolicyContent(policy?.content || ""),
    [policy?.content]
  );

  if (!slug) {
    return (
      <PolicyNotFound message="No policy was selected." />
    );
  }

  if (loading) {
    return <PolicyLoading />;
  }

  if (!policy) {
    return (
      <PolicyNotFound
        message={
          errorMessage ||
          "This policy may not exist yet or has not been published."
        }
      />
    );
  }

  return (
    <TrustLayout
      title={policy.title}
      description={policy.description}
      version={policy.version}
      effectiveDate={formatDate(
        policy.effective_date
      )}
      lastReviewed={formatDate(
        policy.last_reviewed
      )}
      nextReview={formatDate(
        policy.next_review
      )}
    >
      <PolicyOverview policy={policy} />

      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <PolicyNavigation
          sections={parsedContent.sections}
        />

        <div className="space-y-8">
          <PolicySection
            icon={FileText}
            title="Policy Details"
          >
            <PolicyContent
              parsedContent={parsedContent}
            />
          </PolicySection>

          <PolicySection
            icon={Mail}
            title="Contact"
          >
            <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.05] p-6">
              <p className="text-sm leading-8 text-slate-400">
                For questions about this policy, contact{" "}
                <a
                  href="mailto:trust@aemasystems.com"
                  className="font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  trust@aemasystems.com
                </a>
                .
              </p>
            </div>
          </PolicySection>
        </div>
      </div>
    </TrustLayout>
  );
}

function PolicyOverview({ policy }) {
  const items = [
    {
      label: "Status",
      value: policy.status || "Published",
      icon: CheckCircle2,
    },
    {
      label: "Version",
      value: policy.version || "1.0",
      icon: FileText,
    },
    {
      label: "Effective",
      value: formatDate(policy.effective_date),
      icon: Clock3,
    },
    {
      label: "Next review",
      value: formatDate(policy.next_review),
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/[0.08] via-white/[0.03] to-emerald-400/[0.06] p-6 shadow-2xl shadow-black/20 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10">
                <Icon className="h-4 w-4 text-cyan-300" />
              </span>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {label}
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PolicyNavigation({ sections }) {
  if (!sections.length) return null;

  return (
    <aside className="xl:sticky xl:top-24 xl:self-start">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10">
            <Link2 className="h-4 w-4 text-cyan-300" />
          </span>

          <div>
            <p className="text-sm font-bold text-white">
              On this page
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Jump to a section
            </p>
          </div>
        </div>

        <nav className="mt-5 space-y-2">
          {sections.map((section, index) => (
            <a
              key={`${section.id}-${index}`}
              href={`#${section.id}`}
              className="group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <ChevronRight className="h-3.5 w-3.5 text-slate-600 transition group-hover:text-cyan-300" />

              <span className="line-clamp-2">
                {section.title}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function PolicyContent({ parsedContent }) {
  const { preamble, sections } = parsedContent;

  if (!preamble.length && !sections.length) {
    return (
      <p className="text-sm leading-8 text-slate-400">
        No policy content has been added yet.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {preamble.length > 0 && (
        <div className="space-y-4">
          {preamble.map((block, index) => (
            <PolicyBlock
              key={`preamble-${index}`}
              block={block}
            />
          ))}
        </div>
      )}

      {sections.map((section, index) => (
        <section
          key={`${section.id}-${index}`}
          id={section.id}
          className="scroll-mt-24 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 shadow-xl shadow-black/10 md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-black text-cyan-300">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black tracking-tight text-white">
                {section.title}
              </h2>

              <div className="mt-6 space-y-5">
                {section.blocks.map((block, blockIndex) => (
                  <PolicyBlock
                    key={`${section.id}-${blockIndex}`}
                    block={block}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

function PolicyBlock({ block }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-sm leading-8 text-slate-400 sm:text-[15px]">
        <InlineMarkdown text={block.text} />
      </p>
    );
  }

  if (block.type === "blockquote") {
    return (
      <blockquote className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] px-5 py-4 text-sm leading-7 text-cyan-100">
        <InlineMarkdown text={block.text} />
      </blockquote>
    );
  }

  if (block.type === "unordered-list") {
    return (
      <ul className="space-y-3">
        {block.items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex gap-3 text-sm leading-7 text-slate-400"
          >
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

            <span>
              <InlineMarkdown text={item} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ordered-list") {
    return (
      <ol className="space-y-3">
        {block.items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex gap-3 text-sm leading-7 text-slate-400"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-bold text-slate-300">
              {index + 1}
            </span>

            <span>
              <InlineMarkdown text={item} />
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "table") {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-white/[0.05]">
              <tr>
                {block.headers.map((header, index) => (
                  <th
                    key={`${header}-${index}`}
                    className="border-b border-white/10 px-4 py-3 font-bold text-white"
                  >
                    <InlineMarkdown text={header} />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className="border-b border-white/5 last:border-b-0"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${cell}-${cellIndex}`}
                      className="px-4 py-3 align-top leading-6 text-slate-400"
                    >
                      <InlineMarkdown text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (block.type === "subheading") {
    return (
      <h3 className="pt-2 text-lg font-bold text-white">
        {block.text}
      </h3>
    );
  }

  return null;
}

function InlineMarkdown({ text = "" }) {
  const parts = tokenizeInlineMarkdown(text);

  return parts.map((part, index) => {
    if (part.type === "bold") {
      return (
        <strong
          key={`${part.value}-${index}`}
          className="font-bold text-slate-200"
        >
          {part.value}
        </strong>
      );
    }

    if (part.type === "link") {
      return (
        <a
          key={`${part.value}-${index}`}
          href={part.href}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-cyan-300 underline decoration-cyan-400/30 underline-offset-4 transition hover:text-cyan-200"
        >
          {part.value}
        </a>
      );
    }

    if (part.type === "code") {
      return (
        <code
          key={`${part.value}-${index}`}
          className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-emerald-200"
        >
          {part.value}
        </code>
      );
    }

    return (
      <span key={`${part.value}-${index}`}>
        {part.value}
      </span>
    );
  });
}

function parsePolicyContent(content = "") {
  const normalized = String(content)
    .replace(/\r\n/g, "\n")
    .trim();

  if (!normalized) {
    return {
      preamble: [],
      sections: [],
    };
  }

  const lines = normalized.split("\n");
  const preamble = [];
  const sections = [];
  let currentSection = null;
  let currentBlocks = [];
  let paragraphBuffer = [];
  let listBuffer = [];
  let listType = null;

  function pushBlock(block) {
    if (currentSection) {
      currentBlocks.push(block);
    } else {
      preamble.push(block);
    }
  }

  function flushParagraph() {
    const paragraph = paragraphBuffer
      .join(" ")
      .trim();

    if (paragraph) {
      pushBlock({
        type: "paragraph",
        text: paragraph,
      });
    }

    paragraphBuffer = [];
  }

  function flushList() {
    if (listBuffer.length > 0 && listType) {
      pushBlock({
        type: listType,
        items: listBuffer,
      });
    }

    listBuffer = [];
    listType = null;
  }

  function flushSection() {
    flushParagraph();
    flushList();

    if (currentSection) {
      sections.push({
        ...currentSection,
        blocks: currentBlocks,
      });
    }

    currentSection = null;
    currentBlocks = [];
  }

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch =
      line.match(/^#{1,6}\s+(.+)$/);

    if (headingMatch) {
      const headingLevel =
        line.match(/^#+/)?.[0]?.length || 1;

      if (headingLevel <= 2) {
        flushSection();

        currentSection = {
          title: headingMatch[1].trim(),
          id: createAnchorId(
            headingMatch[1]
          ),
        };
      } else {
        flushParagraph();
        flushList();

        pushBlock({
          type: "subheading",
          text: headingMatch[1].trim(),
        });
      }

      continue;
    }

    const numberedHeadingMatch =
      line.match(/^\d+\.\s+(.+)$/);

    if (
      numberedHeadingMatch &&
      !looksLikeListContinuation(lines, index)
    ) {
      flushSection();

      currentSection = {
        title: numberedHeadingMatch[1].trim(),
        id: createAnchorId(
          numberedHeadingMatch[1]
        ),
      };

      continue;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      flushList();

      pushBlock({
        type: "blockquote",
        text: line.replace(/^>\s?/, ""),
      });

      continue;
    }

    const unorderedMatch =
      line.match(/^[-*]\s+(.+)$/);

    if (unorderedMatch) {
      flushParagraph();

      if (
        listType &&
        listType !== "unordered-list"
      ) {
        flushList();
      }

      listType = "unordered-list";
      listBuffer.push(unorderedMatch[1]);

      continue;
    }

    const orderedMatch =
      line.match(/^\d+\.\s+(.+)$/);

    if (orderedMatch) {
      flushParagraph();

      if (
        listType &&
        listType !== "ordered-list"
      ) {
        flushList();
      }

      listType = "ordered-list";
      listBuffer.push(orderedMatch[1]);

      continue;
    }

    if (
      isTableRow(line) &&
      index + 1 < lines.length &&
      isTableSeparator(
        lines[index + 1].trim()
      )
    ) {
      flushParagraph();
      flushList();

      const headers = splitTableRow(line);
      const rows = [];

      index += 2;

      while (
        index < lines.length &&
        isTableRow(lines[index].trim())
      ) {
        rows.push(
          splitTableRow(lines[index].trim())
        );
        index += 1;
      }

      index -= 1;

      pushBlock({
        type: "table",
        headers,
        rows,
      });

      continue;
    }

    paragraphBuffer.push(line);
  }

  flushSection();

  if (!currentSection) {
    flushParagraph();
    flushList();
  }

  return {
    preamble,
    sections,
  };
}

function tokenizeInlineMarkdown(text = "") {
  const tokens = [];
  const pattern =
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        value: text.slice(
          lastIndex,
          match.index
        ),
      });
    }

    const value = match[0];

    if (
      value.startsWith("**") &&
      value.endsWith("**")
    ) {
      tokens.push({
        type: "bold",
        value: value.slice(2, -2),
      });
    } else if (
      value.startsWith("`") &&
      value.endsWith("`")
    ) {
      tokens.push({
        type: "code",
        value: value.slice(1, -1),
      });
    } else {
      const linkMatch = value.match(
        /^\[([^\]]+)\]\(([^)]+)\)$/
      );

      if (linkMatch) {
        tokens.push({
          type: "link",
          value: linkMatch[1],
          href: linkMatch[2],
        });
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return tokens.length
    ? tokens
    : [{ type: "text", value: text }];
}

function isTableRow(line) {
  return (
    line.startsWith("|") &&
    line.endsWith("|")
  );
}

function isTableSeparator(line) {
  if (!isTableRow(line)) return false;

  return splitTableRow(line).every(
    (cell) => /^:?-{3,}:?$/.test(cell)
  );
}

function splitTableRow(line) {
  return line
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function looksLikeListContinuation(lines, index) {
  const previous = lines[index - 1]?.trim() || "";
  const next = lines[index + 1]?.trim() || "";

  return (
    /^\d+\.\s+/.test(previous) ||
    /^\d+\.\s+/.test(next)
  );
}

function createAnchorId(value) {
  return String(value || "section")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function PolicyLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/30">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10">
          <LoaderCircle className="h-8 w-8 animate-spin text-cyan-300" />
        </span>

        <h1 className="mt-6 text-2xl font-black">
          Loading policy
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          Retrieving the latest published version from the AEMA Trust Center.
        </p>
      </div>
    </main>
  );
}

function PolicyNotFound({ message }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/30">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10">
          <AlertTriangle className="h-8 w-8 text-amber-300" />
        </span>

        <h1 className="mt-6 text-2xl font-black">
          Policy unavailable
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          {message}
        </p>
      </div>
    </main>
  );
}

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
