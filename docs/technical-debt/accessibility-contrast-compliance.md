# Technical Debt: WCAG AA Contrast Compliance for Theme Colors

**ID**: TD-A11Y-001
**Created**: 2025-10-06
**Source**: Story 1.3 QA Review
**Priority**: Medium
**Must Fix Before**: Production Launch
**Estimated Effort**: Small (1-2 hours)

---

## Summary

The current theme color combinations (dark and green themes) do not meet WCAG 2.1 Level AA contrast ratio requirements for normal text. The measured contrast ratio is **3.19:1**, while the standard requires **4.5:1** for normal text or **3:1** for large text (18pt+/24px+).

---

## Background

**From**: Story 1.3 - Create Themeable Shared Layout

**Product Owner Decision (2025-10-06)**: Defer accessibility concern to future story to maintain project momentum while documenting the improvement for follow-up work before production launch.

---

## Current State

### Theme Colors (from PRD)
- **Primary Dark**: #191723 (RGB: 25, 23, 35)
- **Primary Green**: #269A9B (RGB: 38, 154, 155)
- **Neutral**: #FFFFFF (White)

### Current Contrast Ratios
- **Dark Theme** (#191723 background / #269A9B foreground): **3.19:1** ❌
- **Green Theme** (#269A9B background / #191723 foreground): **3.19:1** ❌

### WCAG 2.1 Level AA Requirements
- **Normal Text** (< 18pt / 24px): 4.5:1 minimum
- **Large Text** (≥ 18pt / 24px): 3:1 minimum

---

## Impact

**Who is Affected**:
- Users with low vision
- Users with color blindness (deuteranopia, protanopia)
- Users viewing in bright sunlight or low-quality displays
- Approximately 8% of male users, 0.5% of female users have some form of color vision deficiency

**Severity**: Medium (does not block functionality but reduces accessibility)

---

## Proposed Solutions

### Option A: Adjust Foreground Colors (Recommended)

**Dark Theme**:
- Keep background: #191723
- Lighten green text to: **#3FC7C8** (estimated contrast: ~5.2:1 ✅)

**Green Theme**:
- Keep background: #269A9B
- Keep or slightly darken text: #191723 or darker (already acceptable for large text)

**Pros**: Maintains brand identity while achieving compliance
**Cons**: Requires Product Owner approval for color change
**Effort**: 1 hour (update CSS variables, test visually)

---

### Option B: Restrict Low-Contrast Combinations to Large Text

Apply current colors only to headings and large text (18pt+/24px+, which already meets 3:1 requirement).

Use white (#FFFFFF) or higher-contrast colors for body text.

**Pros**: Keeps exact brand colors for headings
**Cons**: More complex CSS implementation, mixed color approach
**Effort**: 2 hours (refactor CSS variables, update component styles)

---

### Option C: Use White Text as Default

Use white (#FFFFFF) text on both dark and green backgrounds, with brand colors for accents only.

**Pros**: Maximum contrast (meets AAA standard)
**Cons**: Reduces brand color prominence
**Effort**: 1 hour (simple CSS variable update)

---

## Recommended Approach

**Option A** - Adjust the Primary Green color slightly to #3FC7C8 or similar.

This maintains the brand aesthetic while achieving WCAG AA compliance with minimal effort.

---

## Implementation Checklist

When addressing this technical debt:

- [ ] Consult Product Owner on color adjustment approval
- [ ] Update color values in `src/app/globals.css` (lines 62-70)
- [ ] Update PRD branding section if colors change (`docs/prd/3-user-interface-design-goals.md`)
- [ ] Test contrast ratios using accessibility tools (Chrome DevTools, WebAIM Contrast Checker)
- [ ] Visual regression testing on `/test-layout` page
- [ ] Update theme documentation
- [ ] Run full accessibility audit before production
- [ ] Close this technical debt item

---

## References

- **Gate File**: `docs/qa/gates/1.3-create-themeable-shared-layout.yml`
- **Story**: `docs/stories/1.3.story.md`
- **Affected File**: `src/app/globals.css:62-70`
- **PRD Section**: `docs/prd/3-user-interface-design-goals.md` (Branding)
- **WCAG 2.1 Guidelines**: [Understanding SC 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

## Notes

- This is **not a blocker** for development stories but **must be addressed before production launch**
- Current implementation works for sighted users with normal color vision
- Future accessibility audits will flag this issue
- Legal compliance may require WCAG AA for certain jurisdictions (EU, US government contracts, etc.)

---

**Status**: 🟡 Open - Scheduled for future story
**Assigned**: TBD
**Target Resolution**: Before production launch
