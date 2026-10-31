"""Usage: python analyze_results.py sijill_research.csv > summary.json
No biometric dependencies. Trial-level Wilson intervals assume independent trials.
"""
import csv,sys,json,math,statistics
from collections import defaultdict,Counter
def wilson(k,n):
    if not n:return None
    z=1.959963984540054;p=k/n;d=1+z*z/n
    c=(p+z*z/(2*n))/d;h=z*math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d
    return [max(0,c-h),min(1,c+h)]
def analyze(rows):
    ids=[r['trial_id'] for r in rows]
    if len(ids)!=len(set(ids)):raise ValueError('Duplicate trial_id: do not concatenate repeated exports')
    groups=defaultdict(list);invalid=Counter()
    for r in rows:
        if r.get('kind')=='manual_session':continue
        if r['outcome']=='invalid':invalid[r.get('reason','')]+=1;continue
        groups[(r['truth'],r['liveness_enabled'],r['threshold'],r['condition'])].append(r)
    output=[]
    for key,L in sorted(groups.items()):
        counts=Counter(r['outcome'] for r in L);n=len(L)
        categories=['correct_accept','false_reject','wrong_identity'] if key[0]=='genuine' else ['false_accept','correct_reject']
        elapsed=sorted(float(r['duration_ms']) for r in L if r.get('duration_ms','')!='')
        latency={'n':len(elapsed),'median':statistics.median(elapsed),'p95_nearest_rank':elapsed[math.ceil(.95*len(elapsed))-1]} if elapsed else None
        output.append(dict(zip(['truth','liveness_enabled','threshold','condition'],key))|{'n_trials':n,'n_subjects':len({r['subject'] for r in L}),'outcomes':{o:{'count':counts[o],'rate':counts[o]/n,'wilson95_independent_trials':wilson(counts[o],n)} for o in categories},'latency_all_valid_trials_ms':latency,'no_face':sum(r.get('reason')=='no_face' for r in L)})
    return {'warning':'Descriptive trial-level intervals; participant-cluster analysis required for repeated observations. Open-set identification rates are not 1:1 verification FAR/FRR.','invalid':dict(invalid),'groups':output}
if __name__=='__main__':
    with open(sys.argv[1],encoding='utf-8-sig',newline='') as f: print(json.dumps(analyze(list(csv.DictReader(f))),ensure_ascii=False,indent=2))
