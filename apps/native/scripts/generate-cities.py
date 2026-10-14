"""Generate the bundled offline city index from IANA tzdb zone.tab.

zone.tab is public domain (Arthur David Olson / IANA tzdb). Keep the generated
index in the app bundle so search never requires a network connection.
"""

import json
from pathlib import Path

SOURCE = Path('/usr/share/zoneinfo/zone.tab')
OUT = Path(__file__).resolve().parents[1] / 'src/data/cities.json'

cities = []
for line in SOURCE.read_text().splitlines():
    if not line or line.startswith('#'):
        continue
    country, _coordinates, zone, *comment = line.split('\t')
    pieces = zone.split('/')
    name = pieces[-1].replace('_', ' ')
    region = ' / '.join(piece.replace('_', ' ') for piece in pieces[1:-1]) or None
    cities.append({
        'id': zone,
        'name': name,
        'region': region,
        'countryCode': country,
        'timeZone': zone,
        'description': comment[0] if comment else None,
    })

OUT.write_text(json.dumps(cities, ensure_ascii=False, separators=(',', ':')) + '\n')
print(f'Wrote {len(cities)} cities to {OUT}')
