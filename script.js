const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const resumes = [
    {
        name: "Gautam_Kumar_Jha_CV.pdf",
        score: 82,
        date: "5 November 2026"
    },
    {
        name: "Updated_Resume.pdf",
        score: 48,
        date: "5 November 2026"
    }
];

const jobs = [
    ["Associate Product Manager", "Google", "Full-time", "Entry Level", "Bengaluru, India", "Product"],
    ["Associate Software Engineer", "Microsoft", "Full-time", "Entry Level", "Hyderabad, India", "Engineering"],
    ["Software Engineer I", "Amazon", "Full-time", "Entry Level", "Remote", "Engineering"],
    ["Data Analyst Intern", "Deloitte", "Internship", "Entry Level", "Pune, India", "Data"],
    ["Frontend Developer", "Adobe", "Full-time", "Mid Level", "Noida, India", "Development"],
    ["Python Developer Intern", "Infosys", "Internship", "Entry Level", "Remote", "Development"]
];

let posts = [
    [
        "Best roadmap for DSA and CP (with all free resources you need?)",
        "What resources helped you stay consistent while preparing for technical interviews?"
    ]
];

// PAGE NAVIGATION
function showPage(name) {
    $$('.page').forEach(page => page.classList.add('hidden'));

    const page = $('#' + name + 'Page');

    if (page) {
        page.classList.remove('hidden');
    }

    $$('.nav-item').forEach(button => {
        button.classList.toggle('active', button.dataset.page === name);
    });

    $('#pageCrumb').textContent = ' / ' + name;
}

// RESUME MANAGEMENT
function renderResumes(search = '') {
    const filtered = resumes.filter(resume =>
        resume.name.toLowerCase().includes(search.toLowerCase())
    );

    $('#resumeRows').innerHTML = filtered.map((resume, index) => `
        <tr>
            <td>▤ &nbsp; ${resume.name}</td>
            <td>
                <span class="badge ${resume.score < 60 ? 'low' : ''}">
                    ${resume.score}%
                </span>
            </td>
            <td>
                <button onclick="openResume()">Edit</button>
                <button onclick="deleteResume(${index})">⋯</button>
            </td>
            <td>${resume.date}</td>
        </tr>
    `).join('');

    $('#resumeCount').textContent = filtered.length;
}

function deleteResume(index) {
    resumes.splice(index, 1);
    renderResumes($('#resumeSearch').value);
}

function openResume() {
    showPage('resume');
}

// JOB SEARCH
function renderJobs() {
    const search = $('#jobSearch').value.toLowerCase();
    const type = $('#jobType').value;
    const level = $('#jobLevel').value;

    const filtered = jobs.filter(job =>
        job.join(' ').toLowerCase().includes(search) &&
        (!type || job[2] === type) &&
        (!level || job[3] === level)
    );

    $('#jobGrid').innerHTML = filtered.map(job => `
        <article class="job-card">
            <div class="company-icon">${job[1][0]}</div>

            <div>
                <h3>${job[0]}</h3>
                <b>${job[1]}</b>

                <p>${job[4]}</p>

                <div class="job-meta">
                    <span class="tag">${job[2]}</span>
                    <span class="tag">${job[3]}</span>
                    <span class="tag">${job[5]}</span>
                </div>

                <button class="ghost apply">
                    View opportunity ↗
                </button>
            </div>
        </article>
    `).join('') || '<p class="muted">No matching jobs found.</p>';

    $$('.apply').forEach(button => {
        button.onclick = () => {
            alert('Connect a job API to enable applications.');
        };
    });
}

// COMMUNITY POSTS
function renderPosts() {
    $('#posts').innerHTML = posts.map(post => `
        <article class="post">
            <b>◉ &nbsp; Community member</b>
            <p>${post[0]}</p>
            <p>${post[1]}</p>
            <span class="muted small">
                ♡ Like &nbsp; · &nbsp; Comment
            </span>
        </article>
    `).join('');
}

// RESUME LIVE PREVIEW
function updatePreview() {
    const name = $('#fullName').value || 'Your Name';
    const email = $('#email').value;
    const phone = $('#phone').value;
    const location = $('#location').value;

    function section(title, content) {
        if (!content.trim()) return '';

        return `
            <h2>${title}</h2>
            <p>${content.replace(/</g, '&lt;').replace(/\n/g, '<br>')}</p>
        `;
    }

    $('#resumePreview').innerHTML = `
        <h1>${name.replace(/</g, '&lt;')}</h1>

        <div class="contact">
            ${[email, phone, location].filter(Boolean).join(' | ')}
        </div>

        ${section('Professional Summary', $('#summary').value)}

        ${section('Work Experience', $('#experience').value)}

        ${section('Education', $('#education').value)}

        ${section('Technical Skills', $('#skills').value)}

        ${section('Projects', $('#projects').value)}

        <h2>Additional Information</h2>
        <p>References available upon request.</p>
    `;

    const fields = [
        'fullName',
        'email',
        'phone',
        'location',
        'summary',
        'experience',
        'education',
        'skills',
        'projects'
    ];

    const completed = fields.filter(id =>
        $('#' + id).value.trim()
    ).length;

    const score = Math.round((completed / fields.length) * 100);

    $('#score').textContent = score + '%';
    $('#scoreBar').style.width = score + '%';

    $('#scoreText').textContent =
        score >= 80
            ? 'Your resume profile looks strong.'
            : 'Add more details to improve your resume readiness.';
}

// SAVE RESUME
function saveResume() {
    const name = ($('#fullName').value || 'My') + '_Resume.pdf';

    const existing = resumes.find(resume => resume.name === name);

    if (!existing) {
        resumes.unshift({
            name,
            score: parseInt($('#score').textContent) || 0,
            date: 'Just now'
        });
    } else {
        existing.score = parseInt($('#score').textContent) || 0;
    }

    renderResumes();

    alert('Resume draft saved.');
}

// LOGIN
$('#loginBtn').onclick = () => {
    const email = $('#loginEmail').value;
    const password = $('#loginPassword').value;

    if (!email || !password) {
        alert('Enter your email and password.');
        return;
    }

    $('#loginScreen').classList.add('hidden');
    $('#app').classList.remove('hidden');

    renderResumes();
    renderJobs();
    renderPosts();
    updatePreview();
};

// LOGOUT
$('#logoutBtn').onclick = () => {
    $('#app').classList.add('hidden');
    $('#loginScreen').classList.remove('hidden');
};

// SIDEBAR NAVIGATION
$$('.nav-item').forEach(button => {
    button.onclick = () => showPage(button.dataset.page);
});

// PAGE BUTTONS
$$('[data-go]').forEach(button => {
    button.onclick = () => showPage(button.dataset.go);
});

// RESUME SEARCH
$('#resumeSearch').oninput = event => {
    renderResumes(event.target.value);
};

// JOB FILTERS
$('#filterJobs').onclick = renderJobs;

$('#jobSearch').onkeydown = event => {
    if (event.key === 'Enter') {
        renderJobs();
    }
};

// COMMUNITY
$('#postBtn').onclick = () => {
    const value = $('#postInput').value.trim();

    if (!value) return;

    posts.unshift([value, '']);

    $('#postInput').value = '';

    renderPosts();
};

$('#newPostBtn').onclick = () => {
    $('#postInput').focus();
};

// RESUME MODAL
$('#createResumeBtn').onclick = () => {
    $('#modal').classList.remove('hidden');
};

$('#closeModal').onclick = () => {
    $('#modal').classList.add('hidden');
};

$('#blankResume').onclick = () => {
    $('#modal').classList.add('hidden');
    showPage('resume');
};

// LIVE RESUME UPDATE
$$('.form-section input, .form-section textarea').forEach(element => {
    element.addEventListener('input', updatePreview);
});

// SAVE DRAFT
$('#saveResume').onclick = saveResume;

// DOWNLOAD RESUME PDF
$('#downloadResume').onclick = () => {
    updatePreview();

    const windowPrint = window.open('', '_blank');

    if (!windowPrint) {
        alert('Please allow pop-ups to download your resume.');
        return;
    }

    windowPrint.document.write(`
        <html>
        <head>
            <title>My Resume</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 35px;
                    color: #222;
                }

                h1 {
                    font-size: 25px;
                }

                .contact {
                    border-bottom: 2px solid #333;
                    padding-bottom: 12px;
                    color: #555;
                    font-size: 12px;
                }

                h2 {
                    font-size: 13px;
                    text-transform: uppercase;
                    border-bottom: 1px solid #888;
                    padding-bottom: 5px;
                    margin-top: 24px;
                }

                p {
                    font-size: 12px;
                    line-height: 1.6;
                }
            </style>
        </head>

        <body>
            ${$('#resumePreview').innerHTML}
        </body>
        </html>
    `);

    windowPrint.document.close();

    windowPrint.onload = () => {
        windowPrint.print();
    };
};

// CAREER INTELLIGENCE TABS
$$('.tab').forEach(button => {
    button.onclick = () => {
        $$('.tab').forEach(tab => tab.classList.remove('active'));

        button.classList.add('active');

        $('#insightsPanel').classList.toggle(
            'hidden',
            button.dataset.tab !== 'insights'
        );

        $('#comparePanel').classList.toggle(
            'hidden',
            button.dataset.tab !== 'compare'
        );
    };
});

// CAREER PROFILE ANALYSIS
$('#analyzeBtn').onclick = () => {
    const file = $('#careerFile').files[0];

    $('#analysisStatus').textContent = file
        ? `Selected ${file.name}. PDF parsing requires a backend service.`
        : 'Please select a PDF or resume first.';
};

// CAREER ROADMAP
$('#compareBtn').onclick = () => {
    const role = $('#targetRole').value;

    const skills = {
        'Data Analyst': [
            'SQL',
            'Excel',
            'Python',
            'Statistics',
            'Power BI / Tableau'
        ],

        'Frontend Developer': [
            'HTML',
            'CSS',
            'JavaScript',
            'React',
            'Accessibility'
        ],

        'Backend Developer': [
            'Node.js / Python',
            'REST APIs',
            'Databases',
            'Authentication',
            'Deployment'
        ],

        'Data Scientist': [
            'Python',
            'Statistics',
            'SQL',
            'Machine Learning',
            'Model Evaluation'
        ]
    };

    $('#roadmap').innerHTML = `
        <h3>${role} — Skills to Build</h3>

        ${skills[role].map((skill, index) => `
            <div>
                ☐ &nbsp; ${skill}
                <span class="muted">
                    · Priority ${index < 2 ? 'High' : 'Medium'}
                </span>
            </div>
        `).join('')}
    `;
};

// INITIALIZE
updatePreview();
