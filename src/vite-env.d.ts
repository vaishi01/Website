/// <reference types="vite/client" />

// Type definitions for Canvas staff data
declare module '@/data/canvas-staff.json' {
  interface CanvasStaffData {
    course_name: string;
    instructor: {
      name: string;
      email: string;
      id: string;
    } | null;
    tas: Array<{
      name: string;
      email: string;
      id: string;
      sections?: string;
    }>;
    tutors: Array<{
      name: string;
      email: string;
      id: string;
    }>;
  }
  const data: CanvasStaffData;
  export default data;
}
