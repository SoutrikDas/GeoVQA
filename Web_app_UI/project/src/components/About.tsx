import { Github } from 'lucide-react';

interface TeamMember {
  name: string;
  rollNo: string;
  github?: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Sagnik Kayal', rollNo: '(25AI06021)', github: 'https://github.com/Sagnik2003' },
  { name: 'Arindam Das', rollNo: '(25AI06003)', github: 'https://github.com' },
  { name: 'Soutrik Das', rollNo: '(25AI06011)', github: 'https://github.com/SoutrikDas' },
  { name: 'Deepta Kiran Das', rollNo: '(25AI06005)', github: 'https://github.com' },
  { name: 'Sayan Dey', rollNo: '(25AI06009)', github: 'https://github.com/sayande5673' },
];

export default function About() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Project</h3>
        <p className="text-gray-600 leading-relaxed">
          Geo-Visual QA is an innovative application that uses advanced image analysis to identify geographical locations and answer questions about their features. Upload an image and get instant insights about its location, landmarks, and geographical characteristics.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Team Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teamMembers.map((member) => (
            <div
              key={member.rollNo}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">{member.rollNo}</p>
              </div>
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">View Source Code</h3>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Github className="h-5 w-5" />
          GitHub Repository
        </a>
      </div>
    </div>
  );
}
