import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function DepartmentsWidget() {
  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['/api/departments'],
  });

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Department Directory</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm animate-pulse">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const getIconClass = (icon: string) => {
    return icon || "fas fa-building";
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "bg-green-100":
        return "bg-primary-bg text-primary";
      case "bg-blue-100":
        return "bg-blue-100 text-blue-500";
      case "bg-red-100":
        return "bg-red-100 text-red-500";
      case "bg-yellow-100":
        return "bg-yellow-100 text-yellow-500";
      default:
        return "bg-primary-bg text-primary";
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Department Directory</h3>
        <Link href="/departments">
          <a className="text-primary text-sm font-medium hover:text-primary-dark">View All</a>
        </Link>
      </div>
      
      {departments.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <i className="fas fa-building text-gray-400 text-2xl mb-2"></i>
          <p className="text-gray-600">No departments available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {departments.slice(0, 4).map((department) => (
            <Link key={department.id} href={`/departments/${department.id}`}>
              <a className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className={`w-12 h-12 ${getColorClass(department.color)} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <i className={`${getIconClass(department.icon)} text-xl`}></i>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">{department.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{department.memberCount} members</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
