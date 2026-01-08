---

## FEJLHÅNDTERING

### Problem 1: Forældede eller Forkerte TODO Items

**Symptom:** TODO items fra 3+ måneder siden, completed items stadig pending, duplikate TODOs

**Årsag:**
- TODO items ikke reviewet
- Completed work ikke marked done
- Requirement ændret men TODO ikke opdateret
- Duplicate items i flere dokumenter

**Diagnosticering:**
```bash
# Find alle TODO items
grep -r "\[ \]" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/30_TODOS/INTRO/30_TODOS/

# Count completed items
grep "\[x\]" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/30_TODOS/INTRO/30_TODOS/30_TODOS.md | wc -l

# Find duplicates
grep -r "TODO" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/30_TODOS/INTRO/30_TODOS/ | cut -d: -f2 | sort | uniq -d
```

**Fix:**
1. Review alle TODO items quarterly
2. Mark completed items [x]
3. Delete stale items
4. Consolidate duplicates

**Prevention:**
- Monthly TODO review
- Link completed work
- Automated staleness checker
- Archive completed monthly

---

### Problem 2: Manglende TODO Tracking og Progress Visibility

**Symptom:** Ingen progress tracking, uklart hvem der arbejder på hvad, ikke prioriteret

**Årsag:**
- TODOs ikke assignet
- Ingen deadline/priority
- Ingen status tracking
- Ikke integrated med github

**Diagnosticering:**
```bash
# Check for owner assignment
grep -E "@|By:|Owner" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/30_TODOS/INTRO/30_TODOS/30_TODOS.md | wc -l

# Check for deadlines
grep -E "2026|2025" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/30_TODOS/INTRO/30_TODOS/30_TODOS.md | wc -l
```

**Fix:**
1. Add owner/assignee
2. Add priority levels
3. Create tracking template
4. Link til GitHub issues

**Prevention:**
- Enforce template
- Automated checks
- GitHub integration
- Weekly reports

---

### Problem 3: Manglende TODO Dokumentation

**Symptom:** Uklart hvad TODO betyder, success kriterier ikke defineret, TODOs for vague

**Årsag:**
- Kort/cryptic descriptions
- Ingen acceptance criteria
- Ingen test plan
- Manglende context

**Diagnosticering:**
```bash
# Find short TODOs
grep "\[ \]" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/30_TODOS/INTRO/30_TODOS/30_TODOS.md | awk 'length < 50'

# Check for acceptance criteria
grep -A2 "\[ \]" /home/rasmus/Desktop/projekts/projects/cirkelline-agents/INTRO/30_TODOS/INTRO/30_TODOS/30_TODOS.md | grep -i "accept" | wc -l
```

**Fix:**
1. Expand descriptions
2. Add acceptance criteria
3. Add test plan
4. Create template

**Prevention:**
- Require template
- Code review
- Automated validation
- Example TODOs

---

## CHANGELOG

| Date | Time | Action | By |
|------|------|--------|-----|
| 2026-01-08 | 16:34 | Added FEJLHÅNDTERING section (3 problems) | Kv1nt |

## CHANGELOG

| Dato | Tid | Handling | Af |
|------|-----|----------|-----|
| 2026-01-02 | 00:00 | Active task list documentation created | Kv1nt |
