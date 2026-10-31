import sys,json,hashlib
from pathlib import Path
import os
os.chdir(Path(__file__).resolve().parent.parent)
sys.path.insert(0,'.')
from analyze_results import analyze,wilson
base={'trial_id':'a','truth':'genuine','liveness_enabled':'0','threshold':'0.5','condition':'baseline','subject':'P001','outcome':'correct_accept'}
assert analyze([base])['groups'][0]['n_trials']==1
try:analyze([base,base]);raise AssertionError('duplicates accepted')
except ValueError:pass
assert wilson(0,0) is None
assert 0.95<wilson(80,80)[0]<1
invalid=base|{'trial_id':'b','outcome':'invalid','reason':'aborted'}
assert analyze([invalid])['invalid']['aborted']==1
for p in Path('models').glob('*manifest.json'):
    for group in json.loads(p.read_text()):
        actual=sum((p.parent/f).stat().st_size for f in group['paths'])
        expected=0
        for w in group['weights']:
            n=1
            for v in w['shape']:n*=v
            expected+=n*({'uint8':1,'uint16':2,'float32':4,'int32':4}[w.get('quantization',{}).get('dtype',w['dtype'])])
        assert expected==actual,(p,expected,actual)
provenance=json.loads(Path('provenance.json').read_text(encoding='utf-8'))
assert provenance[2]['sha256']==provenance[5]['sha256']
assert provenance[3]['sha256']==provenance[6]['sha256']
print('PASS: aggregation, duplicate detection, empty denominator, Wilson interval, invalid exclusion, 3 model manifests byte sizes, 2 source hash equivalences')
