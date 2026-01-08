---

## FEJLHÅNDTERING

### Problem 1: Urealistisk Roadmap Timeline

**Symptom:** Deadline blev mistet, feature ikke klar når planlagt, roadmap pushed back

**Årsag:**
- Timeline estimation uden historiske data
- Dependencies ikke modelleret
- Resource availability ikke realistisk
- Scope creep

**Diagnosticering:**
```bash
# Check roadmap dates
grep -E "2026|deadline|Duration" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/50_ROADMAPS/INTRO/50_ROADMAPS/50_ROADMAPS.md | head -20

# Compare planned vs actual
git log --since="2025-12-01" --oneline | wc -l
```

**Fix:**
1. Review historical velocity
2. Adjust timelines
3. Add risk buffer
4. Document assumptions

**Prevention:**
- Track velocity
- Monthly calculation
- Automatic padding (20-30%)
- Regular reviews

---

### Problem 2: Manglende Milestones eller Acceptance Criteria

**Symptom:** Uklart hvad fase skal levere, fuzzy criteria, kan't measure progress

**Årsag:**
- Milestone definition ikke specific
- Success criteria ikke measurable
- No intermediate goals
- Acceptance tests missing

**Diagnosticering:**
```bash
# Find phases without acceptance criteria
grep -A10 "PHASE" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/50_ROADMAPS/INTRO/50_ROADMAPS/50_ROADMAPS.md | grep -v "Acceptance"
```

**Fix:**
1. Create measurable criteria
2. Create milestones
3. Document "done"
4. Create dashboard

**Prevention:**
- Require template
- Automated verification
- Monthly reviews
- Escalation process

---

### Problem 3: Manglende Roadmap Dokumentation

**Symptom:** Uklart hvad fase skal levere, no implementation notes, risks missing

**Årsag:**
- Items er bare overskrifter
- No detailed breakdown
- Missing context
- Owner missing

**Diagnosticering:**
```bash
# Find minimal descriptions
grep "^### " /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/50_ROADMAPS/INTRO/50_ROADMAPS/50_ROADMAPS.md | wc -l

# Check for details
grep -c "Owner\|Dependencies\|Risks" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/50_ROADMAPS/INTRO/50_ROADMAPS/50_ROADMAPS.md
```

**Fix:**
1. Comprehensive phase docs
2. Add task details
3. Document decisions
4. Create mapping

**Prevention:**
- Require detailed docs
- Template for items
- Architecture review
- Peer review

---

## CHANGELOG

| Date | Time | Action | By |
|------|------|--------|-----|
| 2026-01-08 | 16:34 | Added FEJLHÅNDTERING section (3 problems) | Kv1nt |

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Strategic roadmap documentation created | Kv1nt |
