---
name: reconcile-specs
description: Compare and reconcile the two project specifications in `spec1.md` and `spec2.md` one unchecked requirement at a time. Use when the user wants to review differences, choose which version to follow, discuss a recommendation, record consensus by checking both corresponding task items, or continue the iterative specification-review workflow.
disable-model-invocation: true
---

# Reconcile Specifications

Review the two specifications interactively. Treat a checked task as reviewed by consensus, not as proof that the feature has been implemented.

## Select the next batch

1. Work from the repository root and read both `spec1.md` and `spec2.md`.
2. Select a batch up to 10 unchecked related to the one scope tasks in `spec1.md`.
3. Find the semantically corresponding unchecked tasks in `spec2.md`.
   - Match by behavior and intent, not line number or wording.
   - Use the surrounding section and subordinate items as context.
   - Never pair the item with an already checked task.
4. If several items could correspond, show the best candidates and explain the ambiguity.
5. If no corresponding item exists, say so explicitly. Offer to add an agreed counterpart or identify a better match; do not invent or edit a requirement without consensus.

Recognize both unordered and ordered Markdown tasks, including `- [ ] ...` and `1. [ ] ...`.

## Present the choice

Show up to 10 unresolved related to the one scope pairs at a time, with option to choose which we do, show also your recommendation, and possibility to discuss.
Preserve the exact requirement text when quoting it.

It should be look like this:
```
spec1.md:
1. ...
2. ...
3. ...
4. ...

spec2.md
1. ...
2. ...
3. ...
4. ...

Recommendation: ...
```

Do not edit either checkbox while the choice is still being discussed.

## Record consensus

After the user explicitly selects a version or agrees on combined wording:

1. Re-read both files because line numbers or contents may have changed.
2. Confirm the same two unchecked tasks still exist.
3. Change the corresponding task markers from unchecked to checked:
   - `- [ ]` becomes `- [x]`.
   - For an ordered task, preserve its number and change only `[ ]` to `[x]`.
4. Briefly state what was recorded.
5. Write selected version or consessually combined wording to spec_final.md
6. Immediately select and present the next unresolved pair using the same workflow.

If one specification has no corresponding task, resolve that structural difference with the user before checking anything. When `spec1.md` has no unchecked tasks left, report completion and separately list any unchecked tasks remaining only in `spec2.md`.
DO NOT write to `spec1.md` and `spec2.md` anything besides checking or unchecking todos, even if one of files doesn't have correspoding line.
`spec1` and `spec2` should preserve their wordings for audit reasons, we care only about `spec_final`

If user says 'skip', you should check that line, but not write to spec_final.md.
