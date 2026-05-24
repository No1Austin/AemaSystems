import {
  Briefcase,
  Code,
  Brain,
} from "lucide-react";

export default function Founder() {
  return (
    <section
      id="founder"
      className="bg-slate-950 px-6 py-24 text-white md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">

        <div className="mb-16">

          <p className="
          text-sm
          uppercase
          tracking-[0.4em]
          text-blue-400
          ">

            Founder

          </p>


          <h2 className="
          mt-4
          text-5xl
          font-black
          md:text-7xl
          ">

            Austin

            <span className="
            block
            text-blue-500
            ">

              Amadi

            </span>

          </h2>

        </div>



        <div className="
        grid
        gap-16
        lg:grid-cols-[380px_1fr]
        ">



          {/* IMAGE */}

          <div>

            <img
              src="/founder.jpg"
              alt="Austin Amadi"
              className="
              h-[500px]
              w-full
              rounded-[2rem]
              border
              border-white/10
              object-cover
              shadow-2xl
              "
            />


            <div className="
            mt-8
            border-l-2
            border-blue-500
            pl-5
            ">

              <p className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-slate-400
              ">

                Core Belief

              </p>


              <p className="
              mt-3
              text-lg
              leading-8
              text-slate-300
              ">

                You don’t have to be a professional
                to start,
                but you have to start
                to become a professional.

              </p>

            </div>

          </div>




          {/* STORY */}

          <div>

            <p className="
            uppercase
            tracking-[0.35em]
            text-blue-400
            text-sm
            ">

              My Story

            </p>



            <h3 className="
            mt-5
            text-4xl
            font-bold
            ">

              The story behind AEMA Systems

            </h3>



            <div className="
            mt-8
            space-y-8
            text-lg
            leading-9
            text-slate-300
            ">

              <p>

                In my many years of supporting
                small businesses and helping
                businesses grow through operations,
                marketing, digital systems,
                and technology,
                I have always wanted
                to create greater impact.

              </p>



              <p>

                I wanted to help entrepreneurs,
                skilled and unskilled alike,
                start and grow something meaningful
                from their ideas —
                from just an idea
                to companies and brands.

              </p>



              <p>

                I have seen businesses struggle
                with inefficient processes,
                limited access to technology,
                and the challenge of turning
                ideas into systems
                that support growth.

              </p>



              <p>

                AEMA Systems was built from
                one belief:

                ideas deserve systems,
                businesses deserve support,
                and growth deserves structure.

              </p>


              <p>

                Today,
                AEMA Systems helps transform
                ideas into successful businesses
                by building intelligent systems
                and supporting growth
                at every stage of the journey.

              </p>


            </div>



            {/* EXPERIENCE */}

            <div className="
            mt-14
            grid
            gap-5
            md:grid-cols-3
            ">



              <div className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-6
              ">

                <Briefcase
                  className="
                  text-blue-400
                  "
                />


                <p className="
                mt-4
                font-semibold
                ">

                  Operations

                </p>


                <p className="
                mt-2
                text-sm
                text-slate-400
                ">

                  Business systems,
                  workflows and growth.

                </p>

              </div>




              <div className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-6
              ">

                <Code
                  className="
                  text-blue-400
                  "
                />


                <p className="
                mt-4
                font-semibold
                ">

                  Development

                </p>


                <p className="
                mt-2
                text-sm
                text-slate-400
                ">

                  Web apps,
                  dashboards,
                  booking systems.

                </p>

              </div>




              <div className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-6
              ">

                <Brain
                  className="
                  text-blue-400
                  "
                />


                <p className="
                mt-4
                font-semibold
                ">

                  AI Systems

                </p>


                <p className="
                mt-2
                text-sm
                text-slate-400
                ">

                  Automation,
                  intelligent workflows,
                  future systems.

                </p>

              </div>


            </div>


          </div>

        </div>

      </div>

    </section>
  );
}