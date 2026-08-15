const fs = require('fs');
let code = fs.readFileSync('src/components/StudentQuizzesView.tsx', 'utf8');

const lastPart = `          </div>
        </div>
      </div>
    </div>
  );
};`;

code = code.replace(
`        </div>
      </div>
    </div>
  );
};`, 
`      </div>
    </div>
  );
};`
);

fs.writeFileSync('src/components/StudentQuizzesView.tsx', code);
