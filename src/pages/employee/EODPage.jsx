import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { getEODTimelineAPI, submitEODAPI } from "../../api/status.api.js";
import { eodSchema } from "../../schemas/index.js";
import useAuthStore from "../../store/authStore.js";

const isWithinEODWindow = () => {
  const hours = new Date().getHours();
  return hours >= 18 && hours < 21;
};

const EODPage = () => {
  const { user } = useAuthStore();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withinWindow, setWithinWindow] = useState(isWithinEODWindow());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(eodSchema) });

  const fetchTimeline = async () => {
    try {
      const response = await getEODTimelineAPI();
      setTimeline(response.data.data);
    } catch (error) {
      console.error("Failed to fetch EOD timeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
    // Check window every minute
    const interval = setInterval(() => {
      setWithinWindow(isWithinEODWindow());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    try {
      await submitEODAPI(data);
      toast.success("EOD submitted successfully");
      reset();
      fetchTimeline();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit EOD");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">EOD Report</h1>
        <p className="text-gray-500 text-sm mt-1">
          Submit your end of day work report
        </p>
      </div>

      {/* Submit Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Today's Report —{" "}
          <span className="text-gray-500 font-normal">
            {format(new Date(), "MMMM dd, yyyy")}
          </span>
        </h3>

        {!withinWindow && (
          <div className="mb-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            EOD submission is available only between <strong>6:00 PM and 9:00 PM</strong>.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What did you work on today?
            </label>
            <textarea
              {...register("message")}
              rows={5}
              disabled={!withinWindow}
              placeholder={
                withinWindow
                  ? "Describe what you completed today..."
                  : "EOD submission is not available right now"
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!withinWindow || isSubmitting}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit EOD"}
          </button>
        </form>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-6">EOD Timeline</h3>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
          </div>
        ) : timeline.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No EOD reports yet</p>
        ) : (
          <div className="space-y-4">
            {timeline.map((eod) => (
              <div
                key={eod._id}
                className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
                      {eod.employeeName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">
                      {eod.employeeName}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {format(new Date(eod.createdAt), "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-gray-400">
                      Posted at {format(new Date(eod.createdAt), "hh:mm a")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{eod.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EODPage;