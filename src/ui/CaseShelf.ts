import type {CaseBundle,CaseHeader} from '../domain/schema.js';
import type {StorageHealth} from '../storage/case-repository.js';

const EXAMPLES = [
 {rune:'ᚠ',tag:'01 / Observe',question:'What am I actually looking at?',observed:'A runic character is visible.',claim:'A caption calls it a protective charm.',proof:'No original object or dated source has been examined in this example.'},
 {rune:'ᚱ',tag:'02 / Question',question:'Where did that meaning come from?',observed:'A symbol has been reproduced in a modern image.',claim:'Someone says this is an ancient ritual sign.',proof:'The age of an image is not the age of the symbol or its claimed use.'},
 {rune:'ᛟ',tag:'03 / Verify',question:'What would count as evidence?',observed:'The shape can be recorded without assigning it a purpose.',claim:'A modern post attributes a specific meaning to it.',proof:'A located inscription, manuscript, or dated source would be needed to assess that claim.'}
] as const;

function node<K extends keyof HTMLElementTagNameMap>(tag:K,className?:string,text?:string):HTMLElementTagNameMap[K]{
 const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;
}

export type CaseShelfProps={
 cases:CaseHeader[];active:CaseBundle|null;health:StorageHealth;
 onCreate:(name:string)=>Promise<void>;
 onOpen:(id:string)=>Promise<void>;
 onPersist:()=>Promise<void>;
 onQuickImage:(file:File)=>Promise<void>;
 onQuickStart:()=>Promise<void>;
};

export function CaseShelf({cases,active,health,onCreate,onOpen,onPersist,onQuickImage,onQuickStart}:CaseShelfProps):HTMLElement{
 const root=node('section','case-shelf');root.setAttribute('aria-label','Rune Binding home');
 const hero=node('section','atlas-hero');
 const copy=node('div','atlas-copy');
 copy.append(node('p','eyebrow','THE ATLAS OF WHAT IS KNOWN'));
 const heading=node('h2','atlas-headline');heading.append(document.createTextNode('A rune is a mark. '),node('em','', 'Its meaning is a mystery worth investigating.'));copy.append(heading);
 copy.append(node('p','atlas-lede','Have a rune, bind-rune, or mysterious symbol? Start with a picture. Separate what you see from what people claim—and see what the evidence can actually support.'));
 const actions=node('div','atlas-actions');
 const upload=node('button','atlas-primary','Explore my symbol  ↗');upload.type='button';
 const imageInput=node('input','sr-only') as HTMLInputElement;imageInput.type='file';imageInput.accept='image/png,image/jpeg,image/webp';imageInput.setAttribute('aria-label','Choose a rune photo or screenshot');imageInput.id='hero-image';imageInput.tabIndex=-1;
 upload.addEventListener('click',()=>imageInput.click());
 const sample=node('button','atlas-secondary','Try a sample  ↓');sample.type='button';
 actions.append(upload,sample,imageInput);copy.append(actions);
 const cue=node('p','privacy-cue','No account. No title. Your selected image is stored and inspected only on this device—not shared or licensed for redistribution.');copy.append(cue);
 const process=node('div','hero-process');
 for(const [num,title,detail] of [['01','SEE','Start with the symbol'],['02','ASK','Record a claim'],['03','CHECK','Follow the source']] as const){const part=node('div','process-step');part.append(node('span','process-num',num),node('span','process-title',title),node('span','process-detail',detail));process.append(part)}
 copy.append(process);hero.append(copy);
 const visual=node('div','atlas-visual');visual.setAttribute('aria-label','Interactive example: a rune symbol is not historical proof');
 const ambient=node('div','atlas-orbit');ambient.setAttribute('aria-hidden','true');for(const cls of ['orbit-one','orbit-two','orbit-three'] as const)ambient.append(node('span',cls));
 ambient.append(node('span','orbit-flare','✦'));visual.append(ambient);
 const glyph=node('span','atlas-center-glyph',EXAMPLES[0].rune);glyph.setAttribute('aria-hidden','true');visual.append(glyph);
 visual.append(node('span','atlas-coordinate','FORM / CLAIM / SOURCE'));
 const examples=node('div','rune-samples');examples.setAttribute('role','group');examples.setAttribute('aria-label','Example rune symbols');
 const buttons:HTMLButtonElement[]=[];
 const interpret=node('section','interpret-card');interpret.id='example-inspector';interpret.setAttribute('aria-label','Example rune investigation');interpret.append(node('div','demo-label','ILLUSTRATION ONLY · NOT A HISTORICAL FINDING'));
 const question=node('h3','demo-question');const observe=node('p','demo-content'),claim=node('p','demo-content'),proof=node('p','demo-content');
 const exampleRows=node('div','demo-rows');
 for(const [tag,value] of [['WHAT YOU SEE',observe],['WHAT IS CLAIMED',claim],['WHAT IS PROVEN',proof]] as const){const row=node('div','demo-row');row.append(node('span','demo-row-label',tag),value);exampleRows.append(row)}
 interpret.append(question,exampleRows,node('span','unverified-label','RESULT · NOT VERIFIED'));
 const choose=(i:number)=>{const current=EXAMPLES[i];glyph.textContent=current.rune;question.textContent=current.question;observe.textContent=current.observed;claim.textContent=current.claim;proof.textContent=current.proof;buttons.forEach((b,index)=>{b.setAttribute('aria-pressed',String(index===i));b.classList.toggle('selected',index===i)});};
 EXAMPLES.forEach((example,i)=>{const b=node('button','rune-sample',example.rune) as HTMLButtonElement;b.type='button';b.setAttribute('aria-label',`${example.tag}: inspect sample ${example.rune}`);b.addEventListener('click',()=>choose(i));examples.append(b);buttons.push(b)});
 visual.append(examples,interpret);choose(0);hero.append(visual);root.append(hero);
 sample.addEventListener('click',()=>{choose(0);interpret.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});buttons[0].focus({preventScroll:true})});
 const uploadStatus=node('p','form-status hero-upload-status');uploadStatus.setAttribute('role','status');copy.append(uploadStatus);
 let imageBusy=false;imageInput.addEventListener('change',async()=>{if(imageBusy)return;const file=imageInput.files?.[0];if(!file)return;imageBusy=true;upload.disabled=true;imageInput.disabled=true;uploadStatus.textContent='Checking the selected image…';try{await onQuickImage(file)}catch(error){uploadStatus.textContent='Could not start the study: '+String(error)}finally{upload.disabled=false;imageInput.disabled=false;imageInput.value='';imageBusy=false}});

 const next=node('section','lower-deck');const lead=node('div','lower-lead');lead.append(node('p','eyebrow','YOUR RESEARCH, YOUR PACE'),node('h2','','Pick up where you left off.'));
 next.append(lead);
 const columns=node('div','lower-grid');
 const saved=node('section','saved-panel');saved.id='saved-studies';saved.append(node('h3','','Your saved studies'));
 if(!cases.length){saved.append(node('p','','Your investigations will appear here. Start with an image or explore the sample above.'))}
 for(const c of cases){const b=node('button','case-entry') as HTMLButtonElement;b.type='button';b.textContent=c.title;const meta=node('span','case-entry-meta',`Revision ${c.revision} · Stored on this device`);b.append(meta);b.addEventListener('click',()=>{void onOpen(c.id)});saved.append(b)}
 columns.append(saved);
 const alternate=node('section','start-panel');alternate.append(node('h3','','No image? No problem.'),node('p','','Open a blank study and write down what you want to check. Evidence can come later.'));
 const blank=node('button','start-blank','Start without an image  →') as HTMLButtonElement;blank.type='button';blank.addEventListener('click',async()=>{blank.disabled=true;try{await onQuickStart()}catch(err){status.textContent=String(err)}finally{blank.disabled=false}});
 const status=node('p','form-status');status.setAttribute('role','status');alternate.append(blank,status);
 const advanced=node('details','advanced-start');advanced.append(node('summary','', 'Give a study a custom title (optional)'));
 const make=node('form','manual-case');make.innerHTML='<label>Study title<input name="title" required maxlength="300" placeholder="e.g. A symbol on a pendant"></label><button type="submit">Create case</button><p role="status" class="form-status"></p>';
 make.addEventListener('submit',async e=>{e.preventDefault();try{await onCreate(String(new FormData(make).get('title')||''))}catch(err){make.querySelector<HTMLElement>('[role="status"]')!.textContent=String(err)}});
 advanced.append(make);alternate.append(advanced);columns.append(alternate);next.append(columns);
 const storage=node('div','storage-footnote');storage.append(node('span','','PRIVATE WORKSPACE · '),node('span','',health.warning));
 if(health.mode==='PERSISTENT'&&health.persisted!==true){const persistent=node('button','','Protect local storage') as HTMLButtonElement;persistent.type='button';persistent.addEventListener('click',()=>{void onPersist()});storage.append(persistent)}
 next.append(storage);root.append(next);return root;
}
