import React from 'react'
import Footer from './Footer';

export const LandingPage = ({ className, ...props }) => {
    return (
      <div
        className={
          "flex flex-col gap-0 items-start justify-start h-[2418px] relative " +
          className
        }
        style={{
          background:
            "linear-gradient(to left, #f9fafb, #f9fafb), linear-gradient(to left, #ffffff, #ffffff)",
        }}
      >
        <div className="pt-16 flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
          <div className="bg-[#f2f2f2] pt-28 flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative overflow-hidden">
            <div className="bg-[#f2f2f2] flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
              <div className="bg-[#f2f2f2] pr-80 pb-32 pl-80 flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
                <div className="pr-8 pl-8 flex flex-col gap-0 items-start justify-start shrink-0 w-[1280px] max-w-7xl relative">
                  <div className="flex flex-col gap-5 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div
                          className="text-[#111827] text-left font-['Inter-Bold',_sans-serif] text-6xl leading-[60px] font-bold relative self-stretch flex items-center justify-start"
                          style={{ letterSpacing: "-1.5px" }}
                        >
                          Streamline Your Projects,{" "}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div
                          className="text-[#000000] text-left font-['Inter-Bold',_sans-serif] text-6xl leading-[60px] font-bold relative self-stretch flex items-center justify-start"
                          style={{ letterSpacing: "-1.5px" }}
                        >
                          Amplify Your Success{" "}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start justify-start w-[100%] shrink-0 max-w-xl relative">
                      <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-xl leading-7 font-normal relative self-stretch flex items-center justify-start">
                        Empower your team with our intuitive project management
                        <br />
                        platform. Collaborate seamlessly, track progress
                        effortlessly,
                        <br />
                        and deliver results consistently.{" "}
                      </div>
                    </div>
                    <div className="pt-3 flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div className="rounded-md flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div
                          className="bg-[#000000] rounded pt-[17px] pr-[41px] pb-[17px] pl-[41px] flex flex-row gap-0 items-center justify-center self-stretch shrink-0 relative overflow-hidden"
                          style={{
                            boxShadow:
                              "0px 1px 2px -1px rgba(0, 0, 0, 0.10),  0px 1px 3px 0px rgba(0, 0, 0, 0.10)",
                          }}
                        >
                          <div className="text-[#ffffff] text-center font-['Inter-Medium',_sans-serif] text-lg leading-7 font-medium relative flex items-center justify-center">
                            Get Start{" "}
                          </div>
                        </div>
                      </div>
                      <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 w-[193px] relative"></div>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 w-[48.15%] h-[100%] absolute right-[0.73%] left-[51.12%] bottom-[1.35%] top-[-1.35%]">
                  <div className="w-[960px] h-[446px] absolute left-0 top-0 overflow-hidden">
                    <img
                      className="w-[720px] h-[446px] absolute left-[19px] top-[35px]"
                      style={{ objectFit: "cover", aspectRatio: "720/446" }}
                      src="img-1-x-photoroom-10.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f2f2f2] pt-12 pr-80 pb-12 pl-80 flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
            <div className="pr-8 pl-8 flex flex-col gap-10 items-start justify-start shrink-0 w-[1280px] max-w-7xl relative">
              <div className="flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
                <div className="pr-[565.29px] pl-[565.3px] flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
                  <div
                    className="text-[#000000] text-center font-['Inter-SemiBold',_sans-serif] text-base leading-6 font-semibold uppercase relative self-stretch flex items-center justify-center"
                    style={{ letterSpacing: "0.4px" }}
                  >
                    Features{" "}
                  </div>
                </div>
                <div className="pr-[178.11px] pl-[178.09px] flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
                  <div
                    className="text-[#111827] text-center font-['Inter-Bold',_sans-serif] text-4xl leading-10 font-bold relative self-stretch flex items-center justify-center"
                    style={{ letterSpacing: "-0.9px" }}
                  >
                    Everything you need to manage projects effectively{" "}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-8 items-start justify-center self-stretch shrink-0 relative">
                <div className="pl-16 flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
                  <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                    <div className="text-[#111827] text-left font-['Inter-Medium',_sans-serif] text-lg leading-6 font-medium relative self-stretch flex items-center justify-start">
                      Task Management{" "}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                    <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                      Create, assign, and track tasks with ease.
                      <br />
                      Set priorities, deadlines, and
                      <br />
                      dependencies.{" "}
                    </div>
                  </div>
                  <div className="bg-[#000000] rounded-md pt-2.5 pr-3.5 pb-2.5 pl-3.5 flex flex-row gap-0 items-center justify-center shrink-0 w-12 h-12 absolute left-0 top-0">
                    <div className="flex flex-col gap-0 items-start justify-start flex-1 relative">
                      <div className="text-[#ffffff] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-xl leading-7 font-normal relative self-stretch flex items-center justify-start">
                        {" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-16 flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
                  <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                    <div className="text-[#111827] text-left font-['Inter-Medium',_sans-serif] text-lg leading-6 font-medium relative self-stretch flex items-center justify-start">
                      Team Collaboration{" "}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                    <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                      Work together seamlessly with real-time
                      <br />
                      updates, file sharing, and team chat.{" "}
                    </div>
                  </div>
                  <div className="bg-[#000000] rounded-md pt-2.5 pr-[11.5px] pb-2.5 pl-[11.5px] flex flex-row gap-0 items-center justify-center shrink-0 w-12 h-12 absolute left-0 top-0">
                    <div className="flex flex-col gap-0 items-start justify-start flex-1 relative">
                      <div className="text-[#ffffff] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-xl leading-7 font-normal relative self-stretch flex items-center justify-start">
                        {" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-16 flex flex-col gap-2 items-start justify-start self-stretch shrink-0 relative">
                  <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                    <div className="text-[#111827] text-left font-['Inter-Medium',_sans-serif] text-lg leading-6 font-medium relative self-stretch flex items-center justify-start">
                      Progress Tracking{" "}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                    <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                      Monitor project progress with visual
                      <br />
                      dashboards, reports, and analytics.{" "}
                    </div>
                  </div>
                  <div className="bg-[#000000] rounded-md pt-2.5 pr-3.5 pb-2.5 pl-3.5 flex flex-row gap-0 items-center justify-center shrink-0 w-12 h-12 absolute left-0 top-0">
                    <div className="flex flex-col gap-0 items-start justify-start flex-1 relative">
                      <div className="text-[#ffffff] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-xl leading-7 font-normal relative self-stretch flex items-center justify-start">
                        {" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f9fafb] pt-12 pr-80 pb-12 pl-80 flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
            <div className="pr-8 pl-8 flex flex-col gap-16 items-start justify-start shrink-0 w-[1280px] max-w-7xl relative">
              <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                <div className="pr-[369.5px] pl-[369.48px] flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
                  <div className="text-[#111827] text-center font-['Inter-Bold',_sans-serif] text-4xl leading-10 font-bold relative self-stretch flex items-center justify-center">
                    Simple, transparent pricing{" "}
                  </div>
                </div>
                <div className="pr-[430.89px] pl-[430.89px] flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
                  <div className="text-[#6b7280] text-center font-['Inter-Regular',_sans-serif] text-lg leading-7 font-normal relative self-stretch flex items-center justify-center">
                    Choose the plan that&#039;s right for your team{" "}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start justify-center self-stretch shrink-0 relative">
                <div
                  className="bg-[rgba(255,255,255,0.00)] rounded-lg border-solid border-[#e5e7eb] border p-px flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative"
                  style={{ boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)" }}
                >
                  <div className="p-6 flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div className="text-[#111827] text-left font-['Inter-Medium',_sans-serif] text-lg leading-6 font-medium relative self-stretch flex items-center justify-start">
                        Basic{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-sm leading-5 font-normal relative self-stretch flex items-center justify-start">
                        Perfect for small teams getting started{" "}
                      </div>
                    </div>
                    <div className="self-stretch shrink-0 h-[72px] relative">
                      <div className="text-[#111827] text-left font-['Inter-Bold',_sans-serif] text-4xl leading-10 font-bold absolute left-0 top-0 w-[47.44px] h-10 flex items-center justify-start">
                        $9{" "}
                      </div>
                      <div className="text-[#6b7280] text-left font-['Inter-Medium',_sans-serif] text-base leading-6 font-medium absolute left-[51.45px] top-[15px] w-[55.03px] h-6 flex items-center justify-start">
                        /month{" "}
                      </div>
                    </div>
                    <div className="bg-[#000000] rounded pt-2 pr-[117.14px] pb-2 pl-[117.14px] flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
                      <div className="text-[#ffffff] text-center font-['Inter-Medium',_sans-serif] text-base leading-6 font-medium relative self-stretch flex items-center justify-center">
                        Start free trial{" "}
                      </div>
                    </div>
                  </div>
                  <div className="border-solid border-[#e5e7eb] border-t pt-[25px] pr-6 pb-8 pl-6 flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div
                        className="text-[#111827] text-left font-['Inter-Medium',_sans-serif] text-sm leading-5 font-medium uppercase relative self-stretch flex items-center justify-start"
                        style={{ letterSpacing: "0.35px" }}
                      >
                        What&#039;s included{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              Up to 5 team members{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              Basic task management{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              File sharing{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-[rgba(255,255,255,0.00)] rounded-lg border-solid border-[#000000] border p-px flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative"
                  style={{ boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)" }}
                >
                  <div className="p-6 flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div className="text-[#111827] text-left font-['Inter-Medium',_sans-serif] text-lg leading-6 font-medium relative self-stretch flex items-center justify-start">
                        Professional{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-sm leading-5 font-normal relative self-stretch flex items-center justify-start">
                        For growing teams that need more{" "}
                      </div>
                    </div>
                    <div className="self-stretch shrink-0 h-[72px] relative">
                      <div className="text-[#111827] text-left font-['Inter-Bold',_sans-serif] text-4xl leading-10 font-bold absolute left-0 top-0 w-[64.99px] h-10 flex items-center justify-start">
                        $19{" "}
                      </div>
                      <div className="text-[#6b7280] text-left font-['Inter-Medium',_sans-serif] text-base leading-6 font-medium absolute left-[66.98px] top-[15px] w-[55.03px] h-6 flex items-center justify-start">
                        /month{" "}
                      </div>
                    </div>
                    <div className="bg-[#000000] rounded pt-2 pr-[117.14px] pb-2 pl-[117.14px] flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
                      <div className="text-[#ffffff] text-center font-['Inter-Medium',_sans-serif] text-base leading-6 font-medium relative self-stretch flex items-center justify-center">
                        Start free trial{" "}
                      </div>
                    </div>
                  </div>
                  <div className="border-solid border-[#e5e7eb] border-t pt-[25px] pr-6 pb-8 pl-6 flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div
                        className="text-[#111827] text-left font-['Inter-Medium',_sans-serif] text-sm leading-5 font-medium uppercase relative self-stretch flex items-center justify-start"
                        style={{ letterSpacing: "0.35px" }}
                      >
                        What&#039;s included{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              Up to 20 team members{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              Advanced task management{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              Custom workflows{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              Analytics dashboard{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-[rgba(255,255,255,0.00)] rounded-lg border-solid border-[#e5e7eb] border p-px flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative"
                  style={{ boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)" }}
                >
                  <div className="p-6 flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div className="text-[#111827] text-left font-['Inter-Medium',_sans-serif] text-lg leading-6 font-medium relative self-stretch flex items-center justify-start">
                        Enterprise{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-sm leading-5 font-normal relative self-stretch flex items-center justify-start">
                        For large teams and organizations{" "}
                      </div>
                    </div>
                    <div className="pt-4 pb-4 flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div className="text-[#111827] text-left font-['Inter-Bold',_sans-serif] text-4xl leading-10 font-bold relative self-stretch flex items-center justify-start">
                        Custom{" "}
                      </div>
                    </div>
                    <div className="bg-[#000000] rounded pt-2 pr-[117.51px] pb-2 pl-[117.5px] flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
                      <div className="text-[#ffffff] text-center font-['Inter-Medium',_sans-serif] text-base leading-6 font-medium relative self-stretch flex items-center justify-center">
                        Contact sales{" "}
                      </div>
                    </div>
                  </div>
                  <div className="border-solid border-[#e5e7eb] border-t pt-[25px] pr-6 pb-8 pl-6 flex flex-col gap-6 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div
                        className="text-[#111827] text-left font-['Inter-Medium',_sans-serif] text-sm leading-5 font-medium uppercase relative self-stretch flex items-center justify-start"
                        style={{ letterSpacing: "0.35px" }}
                      >
                        What&#039;s included{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              Unlimited team members{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              Enterprise security{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              24/7 support{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                          <div className="text-[#22c55e] text-left font-['FontAwesome5Free-Solid',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                            {" "}
                          </div>
                        </div>
                        <div className="pl-3 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                          <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                            <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative flex items-center justify-start">
                              Custom integration{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#000000] pr-80 pl-80 flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
            <div className="pt-16 pr-8 pb-16 pl-8 flex flex-row items-center justify-between shrink-0 w-[1280px] max-w-7xl relative">
              <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                  <div
                    className="text-[#ffffff] text-left font-['Inter-Bold',_sans-serif] text-4xl leading-10 font-bold relative flex items-center justify-start"
                    style={{ letterSpacing: "-0.9px" }}
                  >
                    Ready to dive in?{" "}
                  </div>
                </div>
                <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                  <div
                    className="text-[#e0e7ff] text-left font-['Inter-Bold',_sans-serif] text-4xl leading-10 font-bold relative flex items-center justify-start"
                    style={{ letterSpacing: "-0.9px" }}
                  >
                    Start your free trial today.{" "}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-0 items-start justify-start shrink-0 relative">
                <div className="rounded-md flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                  <div
                    className="bg-[#ffffff] rounded pt-[13px] pr-[21px] pb-[13px] pl-[21px] flex flex-row gap-0 items-center justify-center shrink-0 relative overflow-hidden"
                    style={{
                      boxShadow:
                        "0px 1px 2px -1px rgba(0, 0, 0, 0.10),  0px 1px 3px 0px rgba(0, 0, 0, 0.10)",
                    }}
                  >
                    <div className="text-[#000000] text-center font-['Inter-Medium',_sans-serif] text-base leading-6 font-medium relative flex items-center justify-center">
                      Get started{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#f2f2f2] pr-80 pl-80 flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
          <div className="pt-16 pr-8 pb-16 pl-8 flex flex-col gap-12 items-start justify-start shrink-0 w-[1280px] max-w-7xl relative">
            <div className="flex flex-row gap-8 items-start justify-center self-stretch shrink-0 relative">
              <div className="flex flex-col gap-8 items-start justify-start self-stretch shrink-0 relative">
                <img
                  className="shrink-0 w-10 h-10 max-w-sm relative overflow-hidden"
                  style={{ objectFit: "cover" }}
                  src="logo-placeholder-png0.png"
                />
                <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                  <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                    Making project management simple and efficient
                    <br />
                    for teams of all sizes.{" "}
                  </div>
                </div>
                <div className="flex flex-row gap-0 items-start justify-start self-stretch shrink-0 relative">
                  <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                    <div className="text-[#9ca3af] text-left font-['FontAwesome5Brands-Regular',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                      {" "}
                    </div>
                  </div>
                  <div className="pl-6 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                      <div className="text-[#9ca3af] text-left font-['FontAwesome5Brands-Regular',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                        {" "}
                      </div>
                    </div>
                  </div>
                  <div className="pl-6 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                      <div className="text-[#9ca3af] text-left font-['FontAwesome5Brands-Regular',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                        {" "}
                      </div>
                    </div>
                  </div>
                  <div className="pl-6 flex flex-col gap-0 items-start justify-center self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start shrink-0 relative">
                      <div className="text-[#9ca3af] text-left font-['FontAwesome5Brands-Regular',_sans-serif] text-base leading-4 font-normal relative flex items-center justify-start">
                        {" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-8 items-start justify-center self-stretch shrink-0 relative">
                <div className="flex flex-row gap-8 items-start justify-center self-stretch shrink-0 relative">
                  <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div
                        className="text-[#9ca3af] text-left font-['Inter-SemiBold',_sans-serif] text-sm leading-5 font-semibold uppercase relative self-stretch flex items-center justify-start"
                        style={{ letterSpacing: "0.7px" }}
                      >
                        Solutions{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          Marketing{" "}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          Development{" "}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          Design{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div
                        className="text-[#9ca3af] text-left font-['Inter-SemiBold',_sans-serif] text-sm leading-5 font-semibold uppercase relative self-stretch flex items-center justify-start"
                        style={{ letterSpacing: "0.7px" }}
                      >
                        Support{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          Help Center{" "}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          Guides{" "}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          API Status{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-8 items-start justify-center self-stretch shrink-0 relative">
                  <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div
                        className="text-[#9ca3af] text-left font-['Inter-SemiBold',_sans-serif] text-sm leading-5 font-semibold uppercase relative self-stretch flex items-center justify-start"
                        style={{ letterSpacing: "0.7px" }}
                      >
                        Company{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          About{" "}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          Blog{" "}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          Careers{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                    <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                      <div
                        className="text-[#9ca3af] text-left font-['Inter-SemiBold',_sans-serif] text-sm leading-5 font-semibold uppercase relative self-stretch flex items-center justify-start"
                        style={{ letterSpacing: "0.7px" }}
                      >
                        Legal{" "}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          Privacy{" "}
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-start">
                          Terms{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-solid border-[#e5e7eb] border-t pt-[33px] flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
              <div className="pr-[429.22px] pl-[429.2px] flex flex-col gap-0 items-center justify-start self-stretch shrink-0 relative">
                <div className="text-[#9ca3af] text-center font-['Inter-Regular',_sans-serif] text-base leading-6 font-normal relative self-stretch flex items-center justify-center">
                  © 2024 Your Company, Inc. All rights reserved.{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
