import sys

with open('src/pages/Community.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def get_block(start_marker):
    start_idx = -1
    for i, line in enumerate(lines):
        if start_marker in line:
            start_idx = i
            break
    if start_idx == -1: return None, -1, -1
    
    depth = 0
    end_idx = -1
    for i in range(start_idx, len(lines)):
        line = lines[i]
        if '<div' in line and '</div>' in line:
            # count occurrences if multiple
            opens = line.count('<div')
            closes = line.count('</div>')
            depth += opens - closes
        else:
            if '<div' in line: depth += 1
            if '</div>' in line: depth -= 1
            
        if depth == 0:
            end_idx = i
            break
            
    return lines[start_idx:end_idx+1], start_idx, end_idx

# We can't easily parse JSX with simple depth because of <motion.div>, <div />, strings, etc.
# But we know exactly where the markers are!
