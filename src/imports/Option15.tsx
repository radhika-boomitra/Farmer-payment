import imgImage12 from "figma:asset/3eb074a8b985ebc2689546ec62d95c0a0f12670e.png";
import imgImage9 from "figma:asset/8f2abebe0ba819426907c4eafd501c51073b782c.png";
import imgBoomitraLogoPrimaryFullColor1 from "figma:asset/07c85663dba665e32cd122ea42197f4e31feb242.png";
import imgRectangle28 from "figma:asset/8a0d7e063dfab11436ed8b318ae677ef45e272fc.png";

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Figtree:Bold',sans-serif] leading-[72px] min-w-full relative shrink-0 text-[#004752] text-[60px] w-[min-content]">URVARA Project: Farmer Payments Launch</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[48px] relative shrink-0 text-[#1d1d1f] text-[32px] w-[1215.471px]">First soil carbon credits issued, enabling climate-linked payments to 6,000 smallholder farmers in India.</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#87c45f] content-stretch flex h-[60px] items-center justify-center p-[10px] relative rounded-[90px] shrink-0 w-[475px]">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[24px] not-italic relative shrink-0 text-[#fefefb] text-[20px] text-center">Transfer payment</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-[80px] top-[383px] w-[1266px]">
      <Frame2 />
      <Frame />
    </div>
  );
}

function Group1() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[103.108px]" data-name="image 12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage12} />
        </div>
      </div>
      <div className="col-1 h-[103.108px] ml-[113.66px] mt-0 relative row-1 w-[96.307px]" data-name="image 9">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-full left-[-44.92%] max-w-none top-0 w-[190.16%]" src={imgImage9} />
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Group1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[80px] top-[723.92px]">
      <p className="font-['Inter:Bold',sans-serif] font-bold h-[26.413px] leading-[24px] not-italic opacity-60 relative shrink-0 text-[20px] text-black w-[176.083px] whitespace-pre-wrap">Our Partners</p>
      <Group />
    </div>
  );
}

function Frame4() {
  return <div className="absolute bg-[rgba(29,29,31,0.6)] h-[1084px] left-0 top-0 w-[1920px]" />;
}

export default function Option() {
  return (
    <div className="bg-[#fefefb] relative size-full" data-name="Option 15">
      <Frame3 />
      <div className="absolute bg-[#e2e0e0] h-[62px] left-0 top-0 w-[1920px]" />
      <div className="absolute h-[26.004px] left-[80px] top-[18px] w-[146.896px]" data-name="Boomitra_Logo_Primary_Full_Color 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBoomitraLogoPrimaryFullColor1} />
      </div>
      <div className="absolute h-[504.426px] left-[calc(66.67%+65.69px)] rounded-[40px] top-[281.18px] w-[494.309px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[40px]">
          <img alt="" className="absolute h-full left-[-32.69%] max-w-none top-0 w-[144.17%]" src={imgRectangle28} />
        </div>
      </div>
      <Frame1 />
      <Frame4 />
    </div>
  );
}